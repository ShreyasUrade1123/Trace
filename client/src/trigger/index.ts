import { task } from "@trigger.dev/sdk/v3";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Base URL for API calls - adjust for your deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ============================================
// LLM Task - Gemini API Integration
// ============================================
interface LLMTaskPayload {
    model: string;
    systemPrompt: string;
    userMessage: string;
    images: string[];
    nodeId: string;
    runId: string;
}

export const llmTask = task({
    id: "llm-execution",
    maxDuration: 120,
    retry: {
        maxAttempts: 2,
    },
    run: async (payload: LLMTaskPayload) => {
        const { model, systemPrompt, userMessage, images, nodeId, runId } = payload;

        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            throw new Error("GOOGLE_AI_API_KEY is not configured");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelInstance = genAI.getGenerativeModel({ model });

        const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

        if (systemPrompt) {
            parts.push({ text: `System: ${systemPrompt}\n\n` });
        }

        parts.push({ text: userMessage });

        for (const imageUrl of images) {
            try {
                const response = await fetch(imageUrl);
                const buffer = await response.arrayBuffer();
                const base64 = Buffer.from(buffer).toString("base64");
                const mimeType = response.headers.get("content-type") || "image/jpeg";

                parts.push({
                    inlineData: {
                        mimeType,
                        data: base64,
                    },
                });
            } catch (error) {
                console.warn(`Failed to fetch image: ${imageUrl}`, error);
            }
        }

        const result = await modelInstance.generateContent(parts);
        const response = result.response;
        const text = response.text();

        return {
            nodeId,
            runId,
            response: text,
            model,
            tokensUsed: response.usageMetadata?.totalTokenCount || 0,
        };
    },
});

// ============================================
// Crop Image Task - Transloadit Integration
// ============================================
interface CropImagePayload {
    imageUrl: string;
    x: number;      // x coordinate in pixels
    y: number;      // y coordinate in pixels
    width: number;  // width in pixels
    height: number; // height in pixels
    nodeId: string;
    runId: string;
}

export const cropImageTask = task({
    id: "crop-image",
    maxDuration: 120,
    retry: {
        maxAttempts: 2,
    },
    run: async (payload: CropImagePayload) => {
        const { imageUrl, x, y, width, height, nodeId, runId } = payload;

        if (!imageUrl) {
            throw new Error("Image URL is required");
        }

        // Call our processing API which uses Transloadit
        const response = await fetch(`${API_BASE_URL}/api/process`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "crop",
                fileUrl: imageUrl,
                x: x || 0,
                y: y || 0,
                width: width || 100,
                height: height || 100,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Crop failed: ${error.error || response.statusText}`);
        }

        const result = await response.json();

        return {
            nodeId,
            runId,
            croppedUrl: result.resultUrl,
            cropDimensions: { x, y, width, height },
            assemblyId: result.assemblyId,
        };
    },
});

// ============================================
// Extract Frame Task - Transloadit Integration
// ============================================
interface ExtractFramePayload {
    videoUrl: string;
    timestamp: number; // timestamp in seconds
    nodeId: string;
    runId: string;
}

export const extractFrameTask = task({
    id: "extract-frame",
    maxDuration: 180,
    retry: {
        maxAttempts: 2,
    },
    run: async (payload: ExtractFramePayload) => {
        const { videoUrl, timestamp, nodeId, runId } = payload;

        if (!videoUrl) {
            throw new Error("Video URL is required");
        }

        // Call our processing API which uses Transloadit
        const response = await fetch(`${API_BASE_URL}/api/process`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "frame",
                fileUrl: videoUrl,
                timestamp: timestamp || 0,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Frame extraction failed: ${error.error || response.statusText}`);
        }

        const result = await response.json();

        return {
            nodeId,
            runId,
            frameUrl: result.resultUrl,
            timestamp,
            assemblyId: result.assemblyId,
        };
    },
});
