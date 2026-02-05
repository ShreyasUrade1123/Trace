import { TriggerClient } from "@trigger.dev/sdk";
import { createAppRoute } from "@trigger.dev/nextjs";

// Create a TriggerClient instance
export const client = new TriggerClient({
    id: "weavy-clone",
    apiKey: process.env.TRIGGER_SECRET_KEY,
});

// Export the Trigger.dev API route handlers for Next.js App Router
export const { POST, dynamic, runtime, preferredRegion } = createAppRoute(client);
