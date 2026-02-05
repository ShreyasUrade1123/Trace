// Node type definitions for Weavy.ai Workflow Builder

export type NodeType =
  | 'text'
  | 'uploadImage'
  | 'uploadVideo'
  | 'llm'
  | 'cropImage'
  | 'extractFrame';

export type HandleType = 'text' | 'image' | 'video' | 'any';

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

// Base node data interface
// Index signature required for React Flow v12 compatibility with Record<string, unknown>
export interface BaseNodeData {
  label: string;
  status?: NodeStatus;
  output?: unknown;
  error?: string;
  isLocked?: boolean;
  [key: string]: unknown; // Index signature for React Flow compatibility
}

// Text Node
export interface TextNodeData extends BaseNodeData {
  text: string;
}

// Upload Image Node
export interface UploadImageNodeData extends BaseNodeData {
  imageUrl?: string;
  fileName?: string;
}

// Upload Video Node
export interface UploadVideoNodeData extends BaseNodeData {
  videoUrl?: string;
  fileName?: string;
}

// LLM Node
export interface LLMNodeData extends BaseNodeData {
  model: string;
  systemPrompt?: string;
  userMessage?: string;
  images?: string[];
  response?: string;
  temperature?: number;
  thinking?: boolean;
}

// Crop Image Node
export interface CropImageNodeData extends BaseNodeData {
  imageUrl?: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  croppedUrl?: string;
  aspectRatio: '1:1' | '3:4' | '4:3' | '16:9' | '9:16' | 'custom';
  sourceWidth?: number;
  sourceHeight?: number;
  outputWidth: number;
  outputHeight: number;
}

// Extract Frame Node
export interface ExtractFrameNodeData extends BaseNodeData {
  videoUrl?: string;
  timestamp: string; // seconds or "50%" for percentage
  frameUrl?: string;
}

// Union type for all node data
export type WorkflowNodeData =
  | TextNodeData
  | UploadImageNodeData
  | UploadVideoNodeData
  | LLMNodeData
  | CropImageNodeData
  | ExtractFrameNodeData;

// Handle configuration
export interface HandleConfig {
  id: string;
  type: HandleType;
  label: string;
  required?: boolean;
}

// Node configuration
export interface NodeConfig {
  label: string;
  color: string;
  icon: string;
  inputs: HandleConfig[];
  outputs: HandleConfig[];
}

// Node configuration map
export const NODE_CONFIG: Record<NodeType, NodeConfig> = {
  text: {
    label: 'Prompt',
    color: '#3b82f6', // blue
    icon: 'Type',
    inputs: [],
    outputs: [{ id: 'output', type: 'text', label: 'Text Output' }],
  },
  uploadImage: {
    label: 'Upload Image',
    color: '#8b5cf6', // purple
    icon: 'Image',
    inputs: [],
    outputs: [{ id: 'output', type: 'image', label: 'Image URL' }],
  },
  uploadVideo: {
    label: 'Upload Video',
    color: '#ec4899', // pink
    icon: 'Video',
    inputs: [],
    outputs: [{ id: 'output', type: 'video', label: 'Video URL' }],
  },
  llm: {
    label: 'Run LLM',
    color: '#10b981', // green
    icon: 'Bot',
    inputs: [
      { id: 'system_prompt', type: 'text', label: 'System Prompt' },
      { id: 'user_message', type: 'text', label: 'User Message', required: true },
      { id: 'images', type: 'image', label: 'Images' },
    ],
    outputs: [{ id: 'output', type: 'text', label: 'Response' }],
  },
  cropImage: {
    label: 'Crop Image',
    color: '#f59e0b', // amber
    icon: 'Crop',
    inputs: [
      { id: 'image_url', type: 'image', label: 'Image', required: true },
      { id: 'x_percent', type: 'text', label: 'X %' },
      { id: 'y_percent', type: 'text', label: 'Y %' },
      { id: 'width_percent', type: 'text', label: 'Width %' },
      { id: 'height_percent', type: 'text', label: 'Height %' },
    ],
    outputs: [{ id: 'output', type: 'image', label: 'Cropped Image' }],
  },
  extractFrame: {
    label: 'Extract Frame',
    color: '#ef4444', // red
    icon: 'Film',
    inputs: [
      { id: 'video_url', type: 'video', label: 'Video', required: true },
      { id: 'timestamp', type: 'text', label: 'Timestamp' },
    ],
    outputs: [{ id: 'output', type: 'image', label: 'Frame Image' }],
  },
};

// React Flow node type
export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

// React Flow edge type
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}
