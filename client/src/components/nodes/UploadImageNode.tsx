'use client';

import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { Upload, X, MoreHorizontal, Loader2 } from 'lucide-react';
import { UploadImageNodeData } from '@/types/nodes';
import { useWorkflowStore } from '@/stores/workflow-store';
import { useDropzone } from 'react-dropzone';
import { NodeContextMenu } from '../ui/NodeContextMenu';
import { RenameModal } from '../ui/RenameModal';

function UploadImageNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as UploadImageNodeData;
    const { updateNodeData, deleteNode } = useWorkflowStore();
    const { getNode } = useReactFlow();

    // Derived state
    const isExecuting = nodeData.status === 'running';
    const [isUploading, setIsUploading] = useState(false);

    // UI State
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

    // Handlers
    const handleDuplicate = () => {
        const currentNode = getNode(id);
        // Logic for duplication if needed
        setIsMenuOpen(false);
    };

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

    // Upload Logic
    const uploadToTransloadit = async (file: File): Promise<string> => {
        const paramsResponse = await fetch('/api/upload/params', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'image' }),
        });

        const { params, signature } = await paramsResponse.json();
        const formData = new FormData();
        formData.append('params', params);
        formData.append('signature', signature);
        formData.append('file', file);

        const uploadResponse = await fetch('https://api2.transloadit.com/assemblies', {
            method: 'POST',
            body: formData,
        });

        const assembly = await uploadResponse.json();
        if (assembly.error) throw new Error(assembly.message || 'Upload failed');

        let result = assembly;
        while (result.ok !== 'ASSEMBLY_COMPLETED') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const pollResponse = await fetch(result.assembly_ssl_url);
            result = await pollResponse.json();
            if (result.error) throw new Error(result.message || 'Processing failed');
        }

        if (result.results.optimized?.length > 0) return result.results.optimized[0].ssl_url;
        if (result.results[':original']?.length > 0) return result.results[':original'][0].ssl_url;
        throw new Error('No upload result');
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0 || nodeData.isLocked) return;
        const file = acceptedFiles[0];
        setIsUploading(true);
        try {
            const imageUrl = await uploadToTransloadit(file);
            updateNodeData(id, { imageUrl, fileName: file.name, output: imageUrl, status: 'success' });
        } catch (error) {
            console.error('Upload failed, using local fallback:', error);
            const localUrl = URL.createObjectURL(file);
            updateNodeData(id, { imageUrl: localUrl, fileName: file.name, output: localUrl, status: 'success' });
        } finally {
            setIsUploading(false);
        }
    }, [id, updateNodeData, nodeData.isLocked]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
        maxFiles: 1,
        disabled: isExecuting || isUploading || nodeData.isLocked,
    });

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (nodeData.isLocked) return;
        updateNodeData(id, { imageUrl: undefined, fileName: undefined, output: undefined, status: 'idle' });
    };

    return (
        <>
            <div
                className={`
                    group relative rounded-xl min-w-[460px] shadow-2xl transition-all duration-200
                    ${selected ? 'bg-[#2B2B2F] ring-2 ring-inset ring-[#333337]' : 'bg-[#212126]'}
                    ${isExecuting ? 'ring-2 ring-[#C084FC]/50' : ''}
                    ${nodeData.status === 'error' ? 'ring-2 ring-red-500' : ''}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4.5 pt-5 pb-[14px]">
                    <span className="font-normal text-gray-200 text-[16px]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {nodeData.label || 'File'}
                    </span>
                    <div className="relative">
                        <button
                            className="text-gray-500 hover:text-white transition-colors"
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        <NodeContextMenu
                            isOpen={isMenuOpen}
                            position={{ x: -10, y: -2 }}
                            onClose={() => setIsMenuOpen(false)}
                            onDuplicate={handleDuplicate}
                            onRename={() => { setIsMenuOpen(false); setIsRenameModalOpen(true); }}
                            onLock={handleLock}
                            onDelete={handleDelete}
                            isLocked={nodeData.isLocked}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="px-4.5 pb-4.5">
                    {/* Dropzone Container with Aspect Ratio */}
                    <div className="relative w-full h-[430px] rounded-lg overflow-hidden mb-3 bg-[#212126] border border-[#323236]">

                        {/* Checkerboard Pattern Background */}
                        {!nodeData.imageUrl && !isUploading && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(45deg, #2A2A2F 25%, transparent 25%),
                                        linear-gradient(-45deg, #2A2A2F 25%, transparent 25%),
                                        linear-gradient(45deg, transparent 75%, #2A2A2F 75%),
                                        linear-gradient(-45deg, transparent 75%, #2A2A2F 75%)
                                    `,
                                    backgroundSize: '30px 30px',
                                    backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px'
                                }}
                            />
                        )}

                        {/* Content States */}
                        {isUploading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#212126]">
                                <Loader2 className="w-8 h-8 text-[#C084FC] animate-spin mb-3" />
                                <p className="text-sm text-gray-400">Uploading...</p>
                            </div>
                        ) : nodeData.imageUrl ? (
                            <div className="relative w-full h-full group/image">
                                <img
                                    src={nodeData.imageUrl}
                                    alt={nodeData.fileName}
                                    className="w-full h-full object-cover"
                                />
                                {!nodeData.isLocked && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                        {/* Using pointer-events-auto on button to capture click through overlay */}
                                        <button
                                            onClick={clearImage}
                                            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors pointer-events-auto"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                {...getRootProps()}
                                className={`
                                    w-full h-full flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative z-10
                                    ${isDragActive ? 'bg-[#C084FC]/10' : 'hover:bg-white/5'}
                                    ${nodeData.isLocked ? 'cursor-not-allowed opacity-60' : ''}
                                `}
                            >
                                <input {...getInputProps()} />
                                <Upload className="w-6 h-6 text-[#E1E1E1] mb-3" />
                                <p className="text-[#E1E1E1] text-[14px] font-medium">
                                    {isDragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Input */}
                    <input
                        type="text"
                        placeholder="Paste a file link"
                        value={nodeData.imageUrl || ''}
                        onChange={(e) => updateNodeData(id, { imageUrl: e.target.value, output: e.target.value })}
                        onKeyDown={(e) => e.stopPropagation()}
                        className={`
                            w-full bg-[#212126] rounded-sm px-3 py-2
                            text-[12px] border border-[#323236] font-regular text-gray-200 placeholder-brown-200
                            focus:outline-none focus:ring-1 focus:ring-[#3D3D41]
                            transition-colors font-medium
                        `}
                        style={{ fontFamily: 'var(--font-dm-sans)' }}
                        disabled={nodeData.isLocked}
                    />
                </div>

                {/* Handle - Floating Right */}
                <div
                    className={`
                        absolute top-[72px] -right-4 w-8 h-8 rounded-full flex items-center justify-center
                        transition-colors duration-200 pointer-events-auto
                        ${selected ? 'bg-[#2B2B2F]' : 'bg-[#212126]'}
                    `}
                >
                    <div className="relative z-10 flex items-center justify-center">
                        <Handle
                            type="source"
                            position={Position.Right}
                            id="output"
                            // Neutral white border to match screenshot style for generic file
                            className={`!w-4 !h-4 !bg-[#2B2B2F] !border-[3.3px] !border-white transition-transform duration-200 hover:scale-110 flex items-center justify-center`}
                        />
                    </div>
                    <div className={`
                        absolute left-full top-[0px] -translate-y-1/2 ml-2
                        flex items-center
                        transition-opacity duration-200
                        ${selected || 'group-hover:opacity-100 opacity-0'}
                    `}>
                        <span className="text-white font-medium text-[14px] whitespace-nowrap" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                            File
                        </span>
                    </div>
                </div>
            </div>

            <RenameModal
                isOpen={isRenameModalOpen}
                initialValue={nodeData.label || 'File'}
                onClose={() => setIsRenameModalOpen(false)}
                onRename={handleRename}
            />
        </>
    );
}

export const UploadImageNode = memo(UploadImageNodeComponent);
