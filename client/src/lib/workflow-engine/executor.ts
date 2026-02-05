import { Node, Edge } from '@xyflow/react';
import { WorkflowNodeData, NodeType } from '@/types/nodes';
import { topologicalSort, getConnectedInputs } from './validation';
import prisma from '@/lib/db';
import { tasks } from "@trigger.dev/sdk/v3";
import type { llmTask } from "@/trigger/tasks/llm-task";
import type { cropImageTask } from "@/trigger/tasks/crop-image-task";
import type { extractFrameTask } from "@/trigger/tasks/extract-frame-task";

export type ExecutionScope = 'FULL' | 'PARTIAL' | 'SINGLE';

export interface ExecutionResult {
    nodeId: string;
    status: 'SUCCESS' | 'FAILED';
    output?: unknown;
    error?: string;
    duration: number;
}

export interface WorkflowExecutionResult {
    runId: string;
    status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
    results: ExecutionResult[];
    duration: number;
}

/**
 * WorkflowExecutor class handles the execution of workflow nodes
 * with parallel processing of independent branches
 */
export class WorkflowExecutor {
    private results: Map<string, ExecutionResult> = new Map();

    constructor(
        private nodes: Node<WorkflowNodeData>[],
        private edges: Edge[],
        private workflowId: string,
        private userId: string
    ) { }

    /**
     * Execute the workflow with the specified scope
     */
    async execute(
        scope: ExecutionScope,
        selectedNodeIds?: string[],
        onNodeStart?: (nodeId: string) => void,
        onNodeComplete?: (nodeId: string, result: ExecutionResult) => void
    ): Promise<WorkflowExecutionResult> {
        const startTime = Date.now();

        // Determine which nodes to execute
        let nodesToExecute: Node<WorkflowNodeData>[];

        switch (scope) {
            case 'FULL':
                nodesToExecute = this.nodes;
                break;
            case 'SINGLE':
                nodesToExecute = this.nodes.filter(n => selectedNodeIds?.includes(n.id));
                break;
            case 'PARTIAL':
                nodesToExecute = this.nodes.filter(n => selectedNodeIds?.includes(n.id));
                break;
            default:
                nodesToExecute = this.nodes;
        }

        if (nodesToExecute.length === 0) {
            return {
                runId: '',
                status: 'FAILED',
                results: [],
                duration: 0,
            };
        }

        // Create workflow run record
        const run = await prisma.workflowRun.create({
            data: {
                workflowId: this.workflowId,
                userId: this.userId,
                scope,
                status: 'RUNNING',
            },
        });

        try {
            // Get execution layers (nodes that can run in parallel)
            const executionLayers = topologicalSort(nodesToExecute, this.edges);

            // Execute layer by layer
            for (const layer of executionLayers) {
                // All nodes in a layer can execute concurrently
                const layerPromises = layer.map(async (nodeId) => {
                    const node = this.nodes.find(n => n.id === nodeId);
                    if (!node) return;

                    onNodeStart?.(nodeId);

                    const result = await this.executeNode(node, run.id);
                    this.results.set(nodeId, result);

                    onNodeComplete?.(nodeId, result);

                    return result;
                });

                await Promise.all(layerPromises);

                // Check if any node in the layer failed
                const layerResults = layer.map(id => this.results.get(id));
                const hasFailed = layerResults.some(r => r?.status === 'FAILED');

                // For strict mode, stop execution on failure
                // For now, continue execution
            }

            // Determine final status
            const allResults = Array.from(this.results.values());
            const hasFailures = allResults.some(r => r.status === 'FAILED');
            const allSuccessful = allResults.every(r => r.status === 'SUCCESS');

            const finalStatus = allSuccessful ? 'SUCCESS' : hasFailures ? 'PARTIAL' : 'SUCCESS';
            const duration = Date.now() - startTime;

            // Update run record
            await prisma.workflowRun.update({
                where: { id: run.id },
                data: {
                    status: finalStatus,
                    completedAt: new Date(),
                    duration,
                },
            });

            return {
                runId: run.id,
                status: finalStatus,
                results: allResults,
                duration,
            };
        } catch (error) {
            const duration = Date.now() - startTime;

            await prisma.workflowRun.update({
                where: { id: run.id },
                data: {
                    status: 'FAILED',
                    completedAt: new Date(),
                    duration,
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
            });

            throw error;
        }
    }

    /**
     * Execute a single node
     */
    private async executeNode(
        node: Node<WorkflowNodeData>,
        runId: string
    ): Promise<ExecutionResult> {
        const startTime = Date.now();
        const nodeType = node.type as NodeType;

        // Create node result record
        const nodeResult = await prisma.nodeResult.create({
            data: {
                runId,
                nodeId: node.id,
                nodeType,
                status: 'RUNNING',
                startedAt: new Date(),
            },
        });

        try {
            // Gather inputs from connected nodes
            const inputs = getConnectedInputs(node.id, this.nodes, this.edges);

            // Merge with results from already-executed nodes
            for (const [handleId, value] of Object.entries(inputs)) {
                // If the input comes from a node we've already executed, use that output
                const incomingEdge = this.edges.find(
                    e => e.target === node.id && e.targetHandle === handleId
                );
                if (incomingEdge) {
                    const sourceResult = this.results.get(incomingEdge.source);
                    if (sourceResult?.output !== undefined) {
                        if (handleId === 'images') {
                            const currentImages = (inputs['images'] as string[]) || [];
                            if (typeof sourceResult.output === 'string') {
                                currentImages.push(sourceResult.output);
                            }
                            inputs['images'] = currentImages;
                        } else {
                            inputs[handleId] = sourceResult.output;
                        }
                    }
                }
            }

            // Execute based on node type
            let output: unknown;

            switch (nodeType) {
                case 'text':
                    output = await this.executeTextNode(node);
                    break;
                case 'uploadImage':
                    output = await this.executeUploadImageNode(node);
                    break;
                case 'uploadVideo':
                    output = await this.executeUploadVideoNode(node);
                    break;
                case 'llm':
                    output = await this.executeLLMNode(node, inputs, runId);
                    break;
                case 'cropImage':
                    output = await this.executeCropImageNode(node, inputs, runId);
                    break;
                case 'extractFrame':
                    output = await this.executeExtractFrameNode(node, inputs, runId);
                    break;
                default:
                    throw new Error(`Unknown node type: ${nodeType}`);
            }

            const duration = Date.now() - startTime;

            // Update node result
            await prisma.nodeResult.update({
                where: { id: nodeResult.id },
                data: {
                    status: 'SUCCESS',
                    input: inputs as object,
                    output: output as object,
                    completedAt: new Date(),
                    duration,
                },
            });

            return {
                nodeId: node.id,
                status: 'SUCCESS',
                output,
                duration,
            };
        } catch (error) {
            const duration = Date.now() - startTime;
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

            return {
                nodeId: node.id,
                status: 'FAILED',
                error: errorMessage,
                duration,
            };
        }
    }

    /**
     * Execute text node - just returns the text value
     */
    private async executeTextNode(node: Node<WorkflowNodeData>): Promise<string> {
        const data = node.data as { text?: string };
        return data.text || '';
    }

    /**
     * Execute upload image node - returns the image URL
     */
    private async executeUploadImageNode(node: Node<WorkflowNodeData>): Promise<string> {
        const data = node.data as { imageUrl?: string };
        if (!data.imageUrl) {
            throw new Error('No image uploaded');
        }
        return data.imageUrl;
    }

    /**
     * Execute upload video node - returns the video URL
     */
    private async executeUploadVideoNode(node: Node<WorkflowNodeData>): Promise<string> {
        const data = node.data as { videoUrl?: string };
        if (!data.videoUrl) {
            throw new Error('No video uploaded');
        }
        return data.videoUrl;
    }

    /**
     * Execute LLM node via Trigger.dev task
     */
    private async executeLLMNode(
        node: Node<WorkflowNodeData>,
        inputs: Record<string, unknown>,
        runId: string
    ): Promise<string> {
        const data = node.data as {
            model?: string;
            systemPrompt?: string;
            userMessage?: string;
        };

        const payload = {
            model: data.model || 'gemini-2.0-flash',
            systemPrompt: (inputs['system_prompt'] as string) || data.systemPrompt || '',
            userMessage: (inputs['user_message'] as string) || data.userMessage || '',
            images: (inputs['images'] as string[]) || [],
            nodeId: node.id,
            runId,
        };

        if (!payload.userMessage) {
            throw new Error('User message is required');
        }

        // Trigger the task and wait for result
        const result = await tasks.triggerAndPoll<typeof llmTask>("llm-execution", payload);

        if (result.status !== 'COMPLETED' || !result.output) {
            throw new Error('LLM execution failed');
        }

        return result.output.response;
    }

    /**
     * Execute crop image node via Trigger.dev task
     */
    private async executeCropImageNode(
        node: Node<WorkflowNodeData>,
        inputs: Record<string, unknown>,
        runId: string
    ): Promise<string> {
        const data = node.data as {
            xPercent?: number;
            yPercent?: number;
            widthPercent?: number;
            heightPercent?: number;
        };

        const imageUrl = inputs['image_url'] as string;
        if (!imageUrl) {
            throw new Error('Image URL is required');
        }

        const payload = {
            imageUrl,
            xPercent: (inputs['x_percent'] as number) ?? data.xPercent ?? 0,
            yPercent: (inputs['y_percent'] as number) ?? data.yPercent ?? 0,
            widthPercent: (inputs['width_percent'] as number) ?? data.widthPercent ?? 100,
            heightPercent: (inputs['height_percent'] as number) ?? data.heightPercent ?? 100,
            nodeId: node.id,
            runId,
        };

        const result = await tasks.triggerAndPoll<typeof cropImageTask>("crop-image", payload);

        if (result.status !== 'COMPLETED' || !result.output) {
            throw new Error('Crop image failed');
        }

        return result.output.croppedUrl;
    }

    /**
     * Execute extract frame node via Trigger.dev task
     */
    private async executeExtractFrameNode(
        node: Node<WorkflowNodeData>,
        inputs: Record<string, unknown>,
        runId: string
    ): Promise<string> {
        const data = node.data as { timestamp?: string };

        const videoUrl = inputs['video_url'] as string;
        if (!videoUrl) {
            throw new Error('Video URL is required');
        }

        const payload = {
            videoUrl,
            timestamp: (inputs['timestamp'] as string) ?? data.timestamp ?? '0',
            nodeId: node.id,
            runId,
        };

        const result = await tasks.triggerAndPoll<typeof extractFrameTask>("extract-frame", payload);

        if (result.status !== 'COMPLETED' || !result.output) {
            throw new Error('Extract frame failed');
        }

        return result.output.frameUrl;
    }
}
