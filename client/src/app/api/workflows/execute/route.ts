import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { topologicalSort, getConnectedInputs } from '@/lib/workflow-engine/validation';
import { Node, Edge } from '@xyflow/react';
import { tasks } from '@trigger.dev/sdk/v3';

const executeWorkflowSchema = z.object({
    workflowId: z.string(),
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
    scope: z.enum(['FULL', 'PARTIAL', 'SINGLE']),
    nodeIds: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const validation = executeWorkflowSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.flatten() },
                { status: 400 }
            );
        }

        const { workflowId, nodes, edges, scope, nodeIds } = validation.data;

        // Determine which nodes to execute
        let nodesToExecute: Node[] = nodes;
        if (scope !== 'FULL' && nodeIds && nodeIds.length > 0) {
            nodesToExecute = nodes.filter((n: Node) => nodeIds.includes(n.id));
        }

        // Create workflow run record
        const run = await prisma.workflowRun.create({
            data: {
                workflowId: workflowId !== 'temp' ? workflowId : undefined as unknown as string,
                userId: user.id,
                scope,
                status: 'RUNNING',
            },
        });

        const startTime = Date.now();
        const results: Array<{
            nodeId: string;
            status: 'SUCCESS' | 'FAILED';
            output?: unknown;
            error?: string;
            duration: number;
        }> = [];

        // Get execution layers
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const executionLayers = topologicalSort(nodesToExecute as any, edges);

        // Store outputs for reference
        const nodeOutputs = new Map<string, unknown>();

        // Initialize outputs from existing node data
        nodes.forEach((node: Node) => {
            if (node.data?.output !== undefined) {
                nodeOutputs.set(node.id, node.data.output);
            }
        });

        // Execute layer by layer
        for (const layer of executionLayers) {
            const layerPromises = layer.map(async (nodeId) => {
                const node = nodes.find((n: Node) => n.id === nodeId);
                if (!node) return;

                const nodeStartTime = Date.now();

                // Create node result record
                const nodeResult = await prisma.nodeResult.create({
                    data: {
                        runId: run.id,
                        nodeId: node.id,
                        nodeType: node.type || 'unknown',
                        status: 'RUNNING',
                        startedAt: new Date(),
                    },
                });

                try {
                    // Gather inputs from connected nodes
                    const inputs = getConnectedInputs(node.id, nodes, edges);

                    // Override with actual outputs from executed nodes
                    edges.forEach((edge: Edge) => {
                        if (edge.target === node.id && edge.targetHandle) {
                            const output = nodeOutputs.get(edge.source);
                            if (output !== undefined) {
                                if (edge.targetHandle === 'images') {
                                    const currentImages = (inputs['images'] as string[]) || [];
                                    if (typeof output === 'string') {
                                        currentImages.push(output);
                                    }
                                    inputs['images'] = currentImages;
                                } else {
                                    inputs[edge.targetHandle] = output;
                                }
                            }
                        }
                    });

                    // Execute based on node type
                    let output: unknown;

                    switch (node.type) {
                        case 'text':
                            output = node.data?.text || '';
                            break;

                        case 'uploadImage':
                            output = node.data?.imageUrl || '';
                            if (!output) throw new Error('No image uploaded');
                            break;

                        case 'uploadVideo':
                            output = node.data?.videoUrl || '';
                            if (!output) throw new Error('No video uploaded');
                            break;

                        case 'llm':
                            // Check if we should skip Trigger.dev
                            if (process.env.SKIP_TRIGGER_DEV === 'true') {
                                output = await executeLLM(node, inputs);
                            } else {
                                output = await executeLLMViaTrigger(node, inputs, run.id);
                            }
                            break;

                        case 'cropImage':
                            if (process.env.SKIP_TRIGGER_DEV === 'true') {
                                output = await executeCropImage(node, inputs);
                            } else {
                                output = await executeCropImageViaTrigger(node, inputs, run.id);
                            }
                            break;

                        case 'extractFrame':
                            if (process.env.SKIP_TRIGGER_DEV === 'true') {
                                output = await executeExtractFrame(node, inputs);
                            } else {
                                output = await executeExtractFrameViaTrigger(node, inputs, run.id);
                            }
                            break;

                        default:
                            output = node.data?.output;
                    }

                    // Store output
                    nodeOutputs.set(node.id, output);

                    const duration = Date.now() - nodeStartTime;

                    // Update node result
                    await prisma.nodeResult.update({
                        where: { id: nodeResult.id },
                        data: {
                            status: 'SUCCESS',
                            input: inputs as object,
                            output: (typeof output === 'object' ? output : { value: output }) as object,
                            completedAt: new Date(),
                            duration,
                        },
                    });

                    results.push({
                        nodeId: node.id,
                        status: 'SUCCESS',
                        output,
                        duration,
                    });
                } catch (error) {
                    const duration = Date.now() - nodeStartTime;
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

                    await prisma.nodeResult.update({
                        where: { id: nodeResult.id },
                        data: {
                            status: 'FAILED',
                            error: errorMessage,
                            completedAt: new Date(),
                            duration,
                        },
                    });

                    results.push({
                        nodeId: node.id,
                        status: 'FAILED',
                        error: errorMessage,
                        duration,
                    });
                }
            });

            await Promise.all(layerPromises);
        }

        // Determine final status
        const hasFailures = results.some(r => r.status === 'FAILED');
        const allSuccessful = results.every(r => r.status === 'SUCCESS');
        const finalStatus = allSuccessful ? 'SUCCESS' : hasFailures ? 'PARTIAL' : 'SUCCESS';
        const totalDuration = Date.now() - startTime;

        // Update run record
        await prisma.workflowRun.update({
            where: { id: run.id },
            data: {
                status: finalStatus,
                completedAt: new Date(),
                duration: totalDuration,
            },
        });

        return NextResponse.json({
            runId: run.id,
            status: finalStatus,
            results,
            duration: totalDuration,
        });
    } catch (error) {
        console.error('Failed to execute workflow:', error);
        return NextResponse.json(
            { error: 'Failed to execute workflow' },
            { status: 500 }
        );
    }
}

// ============================================
// TRIGGER.DEV WRAPPER FUNCTIONS
// These use tasks.triggerAndPoll to run via Trigger.dev
// ============================================

async function executeLLMViaTrigger(
    node: Node,
    inputs: Record<string, unknown>,
    runId: string
): Promise<string> {
    const userMessage = (inputs['user_message'] as string) || (node.data as { userMessage?: string })?.userMessage;
    if (!userMessage) {
        throw new Error('User message is required');
    }

    const payload = {
        model: (node.data as { model?: string })?.model || 'gemini-2.0-flash',
        systemPrompt: (inputs['system_prompt'] as string) || (node.data as { systemPrompt?: string })?.systemPrompt || '',
        userMessage,
        images: (inputs['images'] as string[]) || [],
        nodeId: node.id,
        runId,
    };

    try {
        // Add a timeout to avoid hanging when Trigger.dev is not running
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Trigger.dev timeout - falling back to direct execution')), 10000)
        );

        const triggerPromise = tasks.triggerAndPoll('llm-execution', payload, {
            pollIntervalMs: 1000,
        });

        const result = await Promise.race([triggerPromise, timeoutPromise]) as Awaited<typeof triggerPromise>;

        if (result.status === 'COMPLETED') {
            return result.output?.response;
        } else {
            throw new Error(`LLM task failed with status: ${result.status}`);
        }
    } catch (error) {
        // Fallback to direct execution if Trigger.dev is unavailable
        console.warn('Trigger.dev unavailable, falling back to direct execution:', error);
        return executeLLM(node, inputs);
    }
}

async function executeCropImageViaTrigger(
    node: Node,
    inputs: Record<string, unknown>,
    runId: string
): Promise<string> {
    const imageUrl = inputs['image_url'] as string;
    if (!imageUrl) {
        throw new Error('Image URL is required');
    }

    const payload = {
        imageUrl,
        x: Number(inputs['x_percent'] ?? (node.data as { xPercent?: number })?.xPercent ?? 0),
        y: Number(inputs['y_percent'] ?? (node.data as { yPercent?: number })?.yPercent ?? 0),
        width: Number(inputs['width_percent'] ?? (node.data as { widthPercent?: number })?.widthPercent ?? 100),
        height: Number(inputs['height_percent'] ?? (node.data as { heightPercent?: number })?.heightPercent ?? 100),
        nodeId: node.id,
        runId,
    };

    try {
        // Add a timeout to avoid hanging when Trigger.dev is not running
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Trigger.dev timeout - falling back to direct execution')), 10000)
        );

        const triggerPromise = tasks.triggerAndPoll('crop-image', payload, {
            pollIntervalMs: 1000,
        });

        const result = await Promise.race([triggerPromise, timeoutPromise]) as Awaited<typeof triggerPromise>;

        if (result.status === 'COMPLETED') {
            return result.output?.croppedUrl;
        } else {
            throw new Error(`Crop image task failed with status: ${result.status}`);
        }
    } catch (error) {
        // Fallback to direct execution if Trigger.dev is unavailable
        console.warn('Trigger.dev unavailable, falling back to direct execution:', error);
        return executeCropImage(node, inputs);
    }
}

async function executeExtractFrameViaTrigger(
    node: Node,
    inputs: Record<string, unknown>,
    runId: string
): Promise<string> {
    const videoUrl = inputs['video_url'] as string;
    if (!videoUrl) {
        throw new Error('Video URL is required');
    }

    // Parse timestamp
    const timestampStr = (inputs['timestamp'] ?? (node.data as { timestamp?: string })?.timestamp ?? '0') as string;
    let timestampSeconds = 0;

    if (timestampStr.includes(':')) {
        const parts = timestampStr.split(':').map(Number);
        if (parts.length === 3) {
            timestampSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            timestampSeconds = parts[0] * 60 + parts[1];
        }
    } else {
        timestampSeconds = parseFloat(timestampStr) || 0;
    }

    const payload = {
        videoUrl,
        timestamp: timestampSeconds,
        nodeId: node.id,
        runId,
    };

    try {
        // Add a timeout to avoid hanging when Trigger.dev is not running
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Trigger.dev timeout - falling back to direct execution')), 10000)
        );

        const triggerPromise = tasks.triggerAndPoll('extract-frame', payload, {
            pollIntervalMs: 1000,
        });

        const result = await Promise.race([triggerPromise, timeoutPromise]) as Awaited<typeof triggerPromise>;

        if (result.status === 'COMPLETED') {
            return result.output?.frameUrl;
        } else {
            throw new Error(`Extract frame task failed with status: ${result.status}`);
        }
    } catch (error) {
        // Fallback to direct execution if Trigger.dev is unavailable
        console.warn('Trigger.dev unavailable, falling back to direct execution:', error);
        return executeExtractFrame(node, inputs);
    }
}

// ============================================
// FALLBACK DIRECT EXECUTION FUNCTIONS
// Used when Trigger.dev is unavailable
// ============================================

// LLM execution (direct call for now, can be moved to Trigger.dev)
async function executeLLM(node: Node, inputs: Record<string, unknown>): Promise<string> {
    console.log('[executeLLM] Starting direct LLM execution');
    console.log('[executeLLM] Inputs:', JSON.stringify(inputs, null, 2));

    const { GoogleGenerativeAI } = await import('@google/generative-ai');

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error('Google AI API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelId = (node.data as { model?: string })?.model || 'gemini-2.0-flash';
    console.log('[executeLLM] Using model:', modelId);

    const systemPrompt = (inputs['system_prompt'] as string) || (node.data as { systemPrompt?: string })?.systemPrompt || '';
    console.log('[executeLLM] System prompt:', systemPrompt.substring(0, 100) + '...');

    const model = genAI.getGenerativeModel({
        model: modelId,
        systemInstruction: systemPrompt || undefined,
    });

    const userMessage = (inputs['user_message'] as string) || (node.data as { userMessage?: string })?.userMessage;
    if (!userMessage) {
        throw new Error('User message is required');
    }
    console.log('[executeLLM] User message:', userMessage.substring(0, 100) + '...');

    const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [{ text: userMessage }];

    // Add images if provided
    const images = (inputs['images'] as string[]) || [];
    console.log('[executeLLM] Images count:', images.length);

    for (const imageUrl of images) {
        // Skip blob: URLs - they only work in the browser
        if (imageUrl.startsWith('blob:')) {
            console.warn('[executeLLM] Skipping blob: URL (browser-only):', imageUrl.substring(0, 50));
            continue;
        }

        try {
            console.log('[executeLLM] Fetching image:', imageUrl.substring(0, 80) + '...');
            const response = await fetch(imageUrl);
            if (!response.ok) {
                console.warn('[executeLLM] Failed to fetch image, status:', response.status);
                continue;
            }
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const mimeType = response.headers.get('content-type') || 'image/jpeg';
            console.log('[executeLLM] Image fetched, size:', buffer.byteLength, 'mimeType:', mimeType);

            parts.push({
                inlineData: {
                    data: base64,
                    mimeType,
                },
            });
        } catch (error) {
            console.warn('[executeLLM] Failed to fetch image:', imageUrl, error);
        }
    }

    console.log('[executeLLM] Calling Gemini API with', parts.length, 'parts');
    const startTime = Date.now();

    const result = await model.generateContent(parts);
    const response = result.response;
    const text = response.text();

    console.log('[executeLLM] Gemini responded in', Date.now() - startTime, 'ms');
    console.log('[executeLLM] Response length:', text.length, 'chars');

    return text;
}

// Crop image execution using Transloadit
async function executeCropImage(node: Node, inputs: Record<string, unknown>): Promise<string> {
    console.log('[executeCropImage] Starting crop execution');
    console.log('[executeCropImage] Inputs:', JSON.stringify(inputs, null, 2));

    const imageUrl = inputs['image_url'] as string;
    if (!imageUrl) {
        throw new Error('Image URL is required');
    }

    // Check for blob: URLs - they can't be processed by Transloadit
    if (imageUrl.startsWith('blob:')) {
        console.warn('[executeCropImage] blob: URL detected - Transloadit cannot access browser-only URLs');
        console.warn('[executeCropImage] Returning original URL as fallback (no crop applied)');
        // Return the original URL as-is since we can't crop blob: URLs server-side
        // The crop would need to happen in the browser for blob: URLs
        return imageUrl;
    }

    // Get crop parameters
    const xPercent = inputs['x_percent'] ?? (node.data as { xPercent?: number })?.xPercent ?? 0;
    const yPercent = inputs['y_percent'] ?? (node.data as { yPercent?: number })?.yPercent ?? 0;
    const widthPercent = inputs['width_percent'] ?? (node.data as { widthPercent?: number })?.widthPercent ?? 100;
    const heightPercent = inputs['height_percent'] ?? (node.data as { heightPercent?: number })?.heightPercent ?? 100;

    console.log('[executeCropImage] Crop params:', { xPercent, yPercent, widthPercent, heightPercent });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    console.log('[executeCropImage] Calling /api/process at', baseUrl);

    const response = await fetch(`${baseUrl}/api/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'crop',
            fileUrl: imageUrl,
            x: Number(xPercent),
            y: Number(yPercent),
            width: Number(widthPercent) || 100,
            height: Number(heightPercent) || 100,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('[executeCropImage] Crop failed:', error);
        throw new Error(`Crop failed: ${error.error || response.statusText}`);
    }

    const result = await response.json();
    console.log('[executeCropImage] Crop successful, result URL:', result.resultUrl?.substring(0, 80));
    return result.resultUrl;
}

// Extract frame execution using Transloadit
async function executeExtractFrame(node: Node, inputs: Record<string, unknown>): Promise<string> {
    const videoUrl = inputs['video_url'] as string;
    if (!videoUrl) {
        throw new Error('Video URL is required');
    }

    // Parse timestamp
    const timestampStr = (inputs['timestamp'] ?? (node.data as { timestamp?: string })?.timestamp ?? '0') as string;
    let timestampSeconds = 0;

    if (timestampStr.includes('%')) {
        // Percentage - default to 0 for now (would need video duration)
        timestampSeconds = 0;
    } else if (timestampStr.includes(':')) {
        const parts = timestampStr.split(':').map(Number);
        if (parts.length === 3) {
            timestampSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            timestampSeconds = parts[0] * 60 + parts[1];
        }
    } else {
        timestampSeconds = parseFloat(timestampStr) || 0;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'frame',
            fileUrl: videoUrl,
            timestamp: timestampSeconds,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Frame extraction failed: ${error.error || response.statusText}`);
    }

    const result = await response.json();
    return result.resultUrl;
}

