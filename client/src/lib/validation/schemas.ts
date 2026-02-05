import { z } from 'zod';

// Node data schemas
export const textNodeDataSchema = z.object({
    label: z.string(),
    text: z.string(),
    status: z.enum(['idle', 'running', 'success', 'error']).optional(),
    output: z.unknown().optional(),
    error: z.string().optional(),
});

export const uploadImageNodeDataSchema = z.object({
    label: z.string(),
    imageUrl: z.string().url().optional(),
    fileName: z.string().optional(),
    status: z.enum(['idle', 'running', 'success', 'error']).optional(),
    output: z.unknown().optional(),
    error: z.string().optional(),
});

export const uploadVideoNodeDataSchema = z.object({
    label: z.string(),
    videoUrl: z.string().url().optional(),
    fileName: z.string().optional(),
    status: z.enum(['idle', 'running', 'success', 'error']).optional(),
    output: z.unknown().optional(),
    error: z.string().optional(),
});

export const llmNodeDataSchema = z.object({
    label: z.string(),
    model: z.string(),
    systemPrompt: z.string().optional(),
    userMessage: z.string().optional(),
    images: z.array(z.string()).optional(),
    response: z.string().optional(),
    status: z.enum(['idle', 'running', 'success', 'error']).optional(),
    output: z.unknown().optional(),
    error: z.string().optional(),
});

export const cropImageNodeDataSchema = z.object({
    label: z.string(),
    imageUrl: z.string().url().optional(),
    xPercent: z.number().min(0).max(100),
    yPercent: z.number().min(0).max(100),
    widthPercent: z.number().min(0).max(100),
    heightPercent: z.number().min(0).max(100),
    croppedUrl: z.string().url().optional(),
    status: z.enum(['idle', 'running', 'success', 'error']).optional(),
    output: z.unknown().optional(),
    error: z.string().optional(),
});

export const extractFrameNodeDataSchema = z.object({
    label: z.string(),
    videoUrl: z.string().url().optional(),
    timestamp: z.string(),
    frameUrl: z.string().url().optional(),
    status: z.enum(['idle', 'running', 'success', 'error']).optional(),
    output: z.unknown().optional(),
    error: z.string().optional(),
});

// Position schema
export const positionSchema = z.object({
    x: z.number(),
    y: z.number(),
});

// Generic node schema
export const nodeSchema = z.object({
    id: z.string(),
    type: z.enum(['text', 'uploadImage', 'uploadVideo', 'llm', 'cropImage', 'extractFrame']),
    position: positionSchema,
    data: z.union([
        textNodeDataSchema,
        uploadImageNodeDataSchema,
        uploadVideoNodeDataSchema,
        llmNodeDataSchema,
        cropImageNodeDataSchema,
        extractFrameNodeDataSchema,
    ]),
});

// Edge schema
export const edgeSchema = z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string().optional(),
    targetHandle: z.string().optional(),
});

// Workflow schemas
export const createWorkflowSchema = z.object({
    name: z.string().min(1, 'Workflow name is required').max(100),
    description: z.string().max(500).optional(),
    nodes: z.array(nodeSchema).default([]),
    edges: z.array(edgeSchema).default([]),
});

export const updateWorkflowSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    nodes: z.array(nodeSchema).optional(),
    edges: z.array(edgeSchema).optional(),
});

// Workflow run schemas
export const createRunSchema = z.object({
    workflowId: z.string(),
    scope: z.enum(['FULL', 'PARTIAL', 'SINGLE']),
    nodeIds: z.array(z.string()).optional(),
});

// LLM execution schema
export const llmExecutionSchema = z.object({
    model: z.string(),
    systemPrompt: z.string().optional(),
    userMessage: z.string(),
    images: z.array(z.string()).optional(),
});

// Crop image execution schema
export const cropImageExecutionSchema = z.object({
    imageUrl: z.string().url(),
    xPercent: z.number().min(0).max(100).default(0),
    yPercent: z.number().min(0).max(100).default(0),
    widthPercent: z.number().min(0).max(100).default(100),
    heightPercent: z.number().min(0).max(100).default(100),
});

// Extract frame execution schema
export const extractFrameExecutionSchema = z.object({
    videoUrl: z.string().url(),
    timestamp: z.string().default('0'),
});

// Export types
export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
export type UpdateWorkflowInput = z.infer<typeof updateWorkflowSchema>;
export type CreateRunInput = z.infer<typeof createRunSchema>;
export type LLMExecutionInput = z.infer<typeof llmExecutionSchema>;
export type CropImageExecutionInput = z.infer<typeof cropImageExecutionSchema>;
export type ExtractFrameExecutionInput = z.infer<typeof extractFrameExecutionSchema>;
