import { task } from "@trigger.dev/sdk/v3";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    maxDuration: 120, // 2 minutes
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

        // Build parts array
        const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

        if (systemPrompt) {
            parts.push({ text: `System: ${systemPrompt}\n\n` });
        }

        parts.push({ text: userMessage });

        // Add images if provided
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
