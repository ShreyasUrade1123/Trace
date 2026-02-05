import { task } from "@trigger.dev/sdk/v3";
import sharp from "sharp";

interface CropImagePayload {
    imageUrl: string;
    xPercent: number;
    yPercent: number;
    widthPercent: number;
    heightPercent: number;
    nodeId: string;
    runId: string;
}

export const cropImageTask = task({
    id: "crop-image",
    maxDuration: 60,
    retry: {
        maxAttempts: 2,
    },
    run: async (payload: CropImagePayload) => {
        const { imageUrl, xPercent, yPercent, widthPercent, heightPercent, nodeId, runId } = payload;

        // Fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const imageBuffer = Buffer.from(await response.arrayBuffer());

        // Get image metadata
        const metadata = await sharp(imageBuffer).metadata();
        if (!metadata.width || !metadata.height) {
            throw new Error("Could not determine image dimensions");
        }

        // Calculate crop dimensions
        const left = Math.round((xPercent / 100) * metadata.width);
        const top = Math.round((yPercent / 100) * metadata.height);
        const width = Math.round((widthPercent / 100) * metadata.width);
        const height = Math.round((heightPercent / 100) * metadata.height);

        // Crop the image
        const croppedBuffer = await sharp(imageBuffer)
            .extract({ left, top, width, height })
            .toBuffer();

        // Convert to base64 data URL
        const base64 = croppedBuffer.toString("base64");
        const croppedUrl = `data:image/png;base64,${base64}`;

        return {
            nodeId,
            runId,
            croppedUrl,
            originalDimensions: { width: metadata.width, height: metadata.height },
            cropDimensions: { left, top, width, height },
        };
    },
});
