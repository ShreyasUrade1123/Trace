import { Node, Edge } from '@xyflow/react';
import { WorkflowNodeData } from '@/types/nodes';

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    nodes: Node<WorkflowNodeData>[];
    edges: Edge[];
}

export const PRODUCT_MARKETING_KIT: WorkflowTemplate = {
    id: 'product-marketing-kit',
    name: 'Product Marketing Kit Generator',
    description: 'Demonstrates parallel execution with image processing and LLM generation',

    nodes: [
        // Branch A: Image Processing
        {
            id: 'upload-image-1',
            type: 'uploadImage',
            position: { x: 100, y: 100 },
            data: {
                label: 'Upload Product Photo',
                status: 'idle',
            } as WorkflowNodeData,
        },
        {
            id: 'crop-image-1',
            type: 'cropImage',
            position: { x: 400, y: 100 },
            data: {
                label: 'Crop Product Image',
                xPercent: 10,
                yPercent: 10,
                widthPercent: 80,
                heightPercent: 80,
                status: 'idle',
            } as WorkflowNodeData,
        },
        {
            id: 'text-system-1',
            type: 'text',
            position: { x: 100, y: 300 },
            data: {
                label: 'System Prompt',
                text: 'You are a professional marketing copywriter. Generate a compelling one-paragraph product description based on the image.',
                output: 'You are a professional marketing copywriter. Generate a compelling one-paragraph product description based on the image.',
                status: 'idle',
            } as WorkflowNodeData,
        },
        {
            id: 'text-details-1',
            type: 'text',
            position: { x: 400, y: 300 },
            data: {
                label: 'Product Details',
                text: 'Product: Wireless Bluetooth Headphones. Features: Noise cancellation, 30-hour battery, foldable design.',
                output: 'Product: Wireless Bluetooth Headphones. Features: Noise cancellation, 30-hour battery, foldable design.',
                status: 'idle',
            } as WorkflowNodeData,
        },
        {
            id: 'llm-description',
            type: 'llm',
            position: { x: 700, y: 200 },
            data: {
                label: 'Generate Product Description',
                model: 'gemini-2.0-flash',
                status: 'idle',
            } as WorkflowNodeData,
        },

        // Branch B: Video Frame Extraction
        {
            id: 'upload-video-1',
            type: 'uploadVideo',
            position: { x: 100, y: 500 },
            data: {
                label: 'Upload Product Demo Video',
                status: 'idle',
            } as WorkflowNodeData,
        },
        {
            id: 'extract-frame-1',
            type: 'extractFrame',
            position: { x: 400, y: 500 },
            data: {
                label: 'Extract Frame at 50%',
                timestamp: '50%',
                status: 'idle',
            } as WorkflowNodeData,
        },

        // Convergence Point
        {
            id: 'text-system-2',
            type: 'text',
            position: { x: 700, y: 450 },
            data: {
                label: 'Social Media Prompt',
                text: 'You are a social media manager. Create a tweet-length marketing post based on the product images and description.',
                output: 'You are a social media manager. Create a tweet-length marketing post based on the product images and description.',
                status: 'idle',
            } as WorkflowNodeData,
        },
        {
            id: 'llm-final',
            type: 'llm',
            position: { x: 1000, y: 350 },
            data: {
                label: 'Generate Marketing Post',
                model: 'gemini-2.0-flash',
                status: 'idle',
            } as WorkflowNodeData,
        },
    ],

    edges: [
        // Branch A connections
        { id: 'e1', source: 'upload-image-1', target: 'crop-image-1', sourceHandle: 'output', targetHandle: 'image_url' },
        { id: 'e2', source: 'text-system-1', target: 'llm-description', sourceHandle: 'output', targetHandle: 'system_prompt' },
        { id: 'e3', source: 'text-details-1', target: 'llm-description', sourceHandle: 'output', targetHandle: 'user_message' },
        { id: 'e4', source: 'crop-image-1', target: 'llm-description', sourceHandle: 'output', targetHandle: 'images' },

        // Branch B connections
        { id: 'e5', source: 'upload-video-1', target: 'extract-frame-1', sourceHandle: 'output', targetHandle: 'video_url' },

        // Convergence connections
        { id: 'e6', source: 'text-system-2', target: 'llm-final', sourceHandle: 'output', targetHandle: 'system_prompt' },
        { id: 'e7', source: 'llm-description', target: 'llm-final', sourceHandle: 'output', targetHandle: 'user_message' },
        { id: 'e8', source: 'crop-image-1', target: 'llm-final', sourceHandle: 'output', targetHandle: 'images' },
        { id: 'e9', source: 'extract-frame-1', target: 'llm-final', sourceHandle: 'output', targetHandle: 'images' },
    ],
};

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
    PRODUCT_MARKETING_KIT,
];
