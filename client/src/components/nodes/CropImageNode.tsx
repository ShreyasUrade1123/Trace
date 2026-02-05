'use client';

import { memo, useState, useEffect, useMemo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { MoreHorizontal, Link as LinkIcon, ChevronDown, Asterisk } from 'lucide-react';
import { CropImageNodeData, UploadImageNodeData } from '@/types/nodes';
import { useWorkflowStore } from '@/stores/workflow-store';
import { NodeContextMenu } from '../ui/NodeContextMenu';
import { RenameModal } from '../ui/RenameModal';

type AspectRatioOption = '1:1' | '3:4' | '4:3' | '16:9' | '9:16' | 'custom';

const ASPECT_RATIOS: { label: string; value: AspectRatioOption; ratio: number | null }[] = [
    { label: 'Custom', value: 'custom', ratio: null },
    { label: '1:1', value: '1:1', ratio: 1 },
    { label: '3:4', value: '3:4', ratio: 3 / 4 },
    { label: '4:3', value: '4:3', ratio: 4 / 3 },
    { label: '16:9', value: '16:9', ratio: 16 / 9 },
    { label: '9:16', value: '9:16', ratio: 9 / 16 },
];

function detectAspectRatio(width: number, height: number): AspectRatioOption {
    const ratio = width / height;
    const tolerance = 0.05;

    for (const ar of ASPECT_RATIOS) {
        if (ar.ratio && Math.abs(ratio - ar.ratio) < tolerance) {
            return ar.value;
        }
    }
    return 'custom';
}

function calculateDimensions(
    sourceWidth: number,
    sourceHeight: number,
    aspectRatio: AspectRatioOption
): { width: number; height: number } {
    if (aspectRatio === 'custom') {
        return { width: sourceWidth, height: sourceHeight };
    }

    const targetRatio = ASPECT_RATIOS.find(ar => ar.value === aspectRatio)?.ratio || 1;
    const sourceRatio = sourceWidth / sourceHeight;

    if (sourceRatio > targetRatio) {
        // Source is wider, fit by height
        const newWidth = Math.round(sourceHeight * targetRatio);
        return { width: newWidth, height: sourceHeight };
    } else {
        // Source is taller, fit by width
        const newHeight = Math.round(sourceWidth / targetRatio);
        return { width: sourceWidth, height: newHeight };
    }
}

function CropImageNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as CropImageNodeData;
    const { updateNodeData, deleteNode, edges } = useWorkflowStore();
    const { getNode } = useReactFlow();

    // UI State
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Find connected source image
    const connectedEdge = edges.find(e => e.target === id && e.targetHandle === 'image_url');
    const sourceNode = connectedEdge ? getNode(connectedEdge.source) : null;
    const sourceImageUrl = sourceNode?.data?.imageUrl as string | undefined;

    // Sync source image to node data and detect dimensions
    useEffect(() => {
        if (sourceImageUrl && sourceImageUrl !== nodeData.imageUrl) {
            const img = new Image();
            img.onload = () => {
                const detectedRatio = detectAspectRatio(img.width, img.height);
                const dims = calculateDimensions(img.width, img.height, detectedRatio);
                updateNodeData(id, {
                    imageUrl: sourceImageUrl,
                    output: sourceImageUrl, // Set output for downstream nodes
                    sourceWidth: img.width,
                    sourceHeight: img.height,
                    aspectRatio: detectedRatio,
                    outputWidth: dims.width,
                    outputHeight: dims.height,
                });
            };
            img.src = sourceImageUrl;
        } else if (!sourceImageUrl && nodeData.imageUrl) {
            updateNodeData(id, {
                imageUrl: undefined,
                output: undefined, // Clear output when disconnected
                sourceWidth: undefined,
                sourceHeight: undefined,
                aspectRatio: 'custom',
                outputWidth: 1024,
                outputHeight: 1024,
            });
        }
    }, [sourceImageUrl, nodeData.imageUrl, id, updateNodeData]);

    // Calculate crop overlay dimensions
    const cropOverlay = useMemo(() => {
        if (!nodeData.sourceWidth || !nodeData.sourceHeight) return null;

        const containerSize = 420; // approximate preview size
        const sourceRatio = nodeData.sourceWidth / nodeData.sourceHeight;

        let previewWidth: number, previewHeight: number;
        if (sourceRatio > 1) {
            previewWidth = containerSize;
            previewHeight = containerSize / sourceRatio;
        } else {
            previewHeight = containerSize;
            previewWidth = containerSize * sourceRatio;
        }

        const cropRatio = nodeData.outputWidth / nodeData.outputHeight;
        let cropWidth: number, cropHeight: number;

        if (cropRatio > sourceRatio) {
            cropWidth = previewWidth;
            cropHeight = previewWidth / cropRatio;
        } else {
            cropHeight = previewHeight;
            cropWidth = previewHeight * cropRatio;
        }

        return {
            width: cropWidth,
            height: cropHeight,
            x: (previewWidth - cropWidth) / 2,
            y: (previewHeight - cropHeight) / 2,
            previewWidth,
            previewHeight,
        };
    }, [nodeData.sourceWidth, nodeData.sourceHeight, nodeData.outputWidth, nodeData.outputHeight]);

    // Handlers
    const handleAspectRatioChange = (ratio: AspectRatioOption) => {
        const sourceW = nodeData.sourceWidth || 1024;
        const sourceH = nodeData.sourceHeight || 1024;
        const dims = calculateDimensions(sourceW, sourceH, ratio);
        updateNodeData(id, {
            aspectRatio: ratio,
            outputWidth: dims.width,
            outputHeight: dims.height,
        });
        setIsDropdownOpen(false);
    };

    const handleReset = () => {
        if (nodeData.sourceWidth && nodeData.sourceHeight) {
            const detectedRatio = detectAspectRatio(nodeData.sourceWidth, nodeData.sourceHeight);
            handleAspectRatioChange(detectedRatio);
        } else {
            handleAspectRatioChange('custom');
        }
    };

    const handleDuplicate = () => setIsMenuOpen(false);
    const handleRename = (newName: string) => {
        updateNodeData(id, { label: newName });
        setIsRenameModalOpen(false);
    };
    const handleLock = () => {
        updateNodeData(id, { isLocked: !nodeData.isLocked });
        setIsMenuOpen(false);
    };
    const handleDelete = () => {
        deleteNode(id);
        setIsMenuOpen(false);
    };

    const currentRatioLabel = ASPECT_RATIOS.find(ar => ar.value === nodeData.aspectRatio)?.label || 'Custom';

    return (
        <>
            <div
                className={`
                    group relative rounded-2xl min-w-[460px] shadow-2xl transition-all duration-200
                    ${selected ? 'bg-[#2B2B2F] ring-2 ring-inset ring-[#333337]' : 'bg-[#212126]'}
                `}
                style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
                {/* Left Handle (Input) */}
                <div className="absolute top-[80px] -left-0">
                    <div
                        className={`
                            absolute w-8 h-8 rounded-full flex items-center justify-center -left-4
                            transition-colors duration-200 pointer-events-auto
                            ${selected ? 'bg-[#2B2B2F]' : 'bg-[#212126]'}
                        `}
                    >
                        <div className="relative z-10 flex items-center justify-center">
                            <Handle
                                type="target"
                                position={Position.Left}
                                id="image_url"
                                className={`!w-4 !h-4 !bg-transparent !border-0 transition-transform duration-200 hover:scale-100 flex items-center justify-center`}
                            >
                                <div className="w-6 h-6 rounded-full bg-[#2B2B2F] flex items-center justify-center border-[3.3px] border-[#2B2B2F]">
                                    <div className="w-4 h-4 rounded-full bg-[#FFFFF0] flex items-center justify-center">
                                        <Asterisk className="w-6 h-6 text-[#1C1C1E]" strokeWidth={3.5} />
                                    </div>
                                </div>
                            </Handle>
                        </div>

                        {/* Label */}
                        <div className={`
                            absolute right-full mr-2 top-0 -translate-y-1/2
                            flex items-center
                            transition-opacity duration-200
                            ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                        `}>
                            <span className="text-white font-medium text-[14px] whitespace-nowrap" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                                File<span className="text-[#E1E476]">*</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Handle (Output) */}
                <div className="absolute top-[80px] -right-0">
                    <div
                        className={`
                            absolute w-8 h-8 rounded-full flex items-center justify-center -right-4
                            transition-colors duration-200 pointer-events-auto
                            ${selected ? 'bg-[#2B2B2F]' : 'bg-[#212126]'}
                        `}
                    >
                        <div className="relative z-10 flex items-center justify-center">
                            <Handle
                                type="source"
                                position={Position.Right}
                                id="output"
                                className={`!w-4 !h-4 !bg-[#2B2B2F] !border-[3.3px] !border-white transition-transform duration-200 hover:scale-110 flex items-center justify-center`}
                            />
                        </div>

                        {/* Label */}
                        <div className={`
                            absolute left-full ml-2 top-0 -translate-y-1/2
                            flex items-center
                            transition-opacity duration-200
                            ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                        `}>
                            <span className="text-white font-medium text-[14px] whitespace-nowrap" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                                File
                            </span>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4.5 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                        <span className="font-normal text-gray-200 text-[16px]">
                            {nodeData.label || 'Crop'}
                        </span>
                    </div>

                    <div className="relative">
                        <button
                            className="text-gray-500 hover:text-white transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>

                        <NodeContextMenu
                            isOpen={isMenuOpen}
                            position={{ x: -10, y: -2 }}
                            onClose={() => setIsMenuOpen(false)}
                            onDuplicate={handleDuplicate}
                            onRename={() => {
                                setIsMenuOpen(false);
                                setIsRenameModalOpen(true);
                            }}
                            onLock={handleLock}
                            onDelete={handleDelete}
                            isLocked={nodeData.isLocked}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="px-4.5 pb-4.5">
                    {/* Main Image Preview Area */}
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 bg-[#1A1A1D] flex items-center justify-center">
                        {/* Checkerboard Pattern */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: `
                                    linear-gradient(45deg, #252529 25%, transparent 25%),
                                    linear-gradient(-45deg, #252529 25%, transparent 25%),
                                    linear-gradient(45deg, transparent 75%, #252529 75%),
                                    linear-gradient(-45deg, transparent 75%, #252529 75%)
                                `,
                                backgroundSize: '20px 20px',
                                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                            }}
                        />

                        {/* Image Preview with crop overlay */}
                        {nodeData.imageUrl && cropOverlay && (
                            <div
                                className="relative z-10"
                                style={{
                                    width: cropOverlay.previewWidth,
                                    height: cropOverlay.previewHeight,
                                }}
                            >
                                <img
                                    src={nodeData.imageUrl}
                                    alt="To crop"
                                    className="w-full h-full object-contain"
                                />

                                {/* Crop Overlay - Darkened areas outside crop */}
                                {nodeData.aspectRatio !== 'custom' && (
                                    <>
                                        {/* Top overlay */}
                                        <div
                                            className="absolute bg-black/50 left-0 right-0 top-0"
                                            style={{ height: cropOverlay.y }}
                                        />
                                        {/* Bottom overlay */}
                                        <div
                                            className="absolute bg-black/50 left-0 right-0 bottom-0"
                                            style={{ height: cropOverlay.y }}
                                        />
                                        {/* Left overlay */}
                                        <div
                                            className="absolute bg-black/50 left-0"
                                            style={{
                                                top: cropOverlay.y,
                                                width: cropOverlay.x,
                                                height: cropOverlay.height
                                            }}
                                        />
                                        {/* Right overlay */}
                                        <div
                                            className="absolute bg-black/50 right-0"
                                            style={{
                                                top: cropOverlay.y,
                                                width: cropOverlay.x,
                                                height: cropOverlay.height
                                            }}
                                        />
                                        {/* Crop border */}
                                        <div
                                            className="absolute border-2 border-dashed border-[#E1E476]"
                                            style={{
                                                left: cropOverlay.x,
                                                top: cropOverlay.y,
                                                width: cropOverlay.width,
                                                height: cropOverlay.height,
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        )}

                        {/* Empty state */}
                        {!nodeData.imageUrl && (
                            <div className="text-gray-500 text-sm z-10">
                                Connect an image to crop
                            </div>
                        )}
                    </div>

                    {/* Controls Footer */}
                    <div className="space-y-3">
                        {/* Aspect Ratio */}
                        <div className="flex items-center justify-between">
                            <span className="text-[#9CA3AF] text-[13px]">Aspect ratio</span>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <button
                                        className="flex items-center justify-between w-[140px] bg-[#1C1C1E] border border-[#2C2C2E] rounded px-2 py-1 text-white text-[13px] hover:border-[#3C3C3E] transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDropdownOpen(!isDropdownOpen);
                                        }}
                                    >
                                        <span>{currentRatioLabel}</span>
                                        <ChevronDown className="w-3 h-3 text-gray-500" />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-1 w-[140px] bg-[#1C1C1E] border border-[#2C2C2E] rounded shadow-xl z-50">
                                            {ASPECT_RATIOS.map((ar) => (
                                                <button
                                                    key={ar.value}
                                                    className={`w-full text-left px-2 py-1.5 text-[13px] hover:bg-[#2B2B2F] transition-colors ${nodeData.aspectRatio === ar.value ? 'text-[#E1E476]' : 'text-white'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAspectRatioChange(ar.value);
                                                    }}
                                                >
                                                    {ar.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="text-white text-[13px] hover:text-gray-200 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReset();
                                    }}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div className="flex items-center justify-between">
                            <span className="text-[#9CA3AF] text-[13px]">Dimensions</span>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center w-[66px] bg-[#1C1C1E] border border-[#2C2C2E] rounded px-2 py-1">
                                    <span className="text-[#6B7280] text-[10px] mr-1">W</span>
                                    <input
                                        type="text"
                                        value={nodeData.outputWidth || 1024}
                                        readOnly
                                        className="w-full bg-transparent text-white text-[12px] focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center w-[66px] bg-[#1C1C1E] border border-[#2C2C2E] rounded px-2 py-1">
                                    <span className="text-[#6B7280] text-[10px] mr-1">H</span>
                                    <input
                                        type="text"
                                        value={nodeData.outputHeight || 1024}
                                        readOnly
                                        className="w-full bg-transparent text-white text-[12px] focus:outline-none"
                                    />
                                </div>
                                <button className="p-1 hover:bg-[#2C2C2E] rounded transition-colors border border-[#2C2C2E]">
                                    <LinkIcon className="w-3 h-3 text-[#6B7280]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RenameModal
                isOpen={isRenameModalOpen}
                initialValue={nodeData.label || 'Crop'}
                onClose={() => setIsRenameModalOpen(false)}
                onRename={handleRename}
            />
        </>
    );
}

export const CropImageNode = memo(CropImageNodeComponent);
