export { TextNode } from './TextNode';
export { UploadImageNode } from './UploadImageNode';
export { UploadVideoNode } from './UploadVideoNode';
export { LLMNode } from './LLMNode';
export { CropImageNode } from './CropImageNode';
export { ExtractFrameNode } from './ExtractFrameNode';

import { TextNode } from './TextNode';
import { UploadImageNode } from './UploadImageNode';
import { UploadVideoNode } from './UploadVideoNode';
import { LLMNode } from './LLMNode';
import { CropImageNode } from './CropImageNode';
import { ExtractFrameNode } from './ExtractFrameNode';

// Node types map for React Flow
export const nodeTypes = {
    text: TextNode,
    uploadImage: UploadImageNode,
    uploadVideo: UploadVideoNode,
    llm: LLMNode,
    cropImage: CropImageNode,
    extractFrame: ExtractFrameNode,
};
