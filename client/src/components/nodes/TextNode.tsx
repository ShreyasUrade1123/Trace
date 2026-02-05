'use client';

import { memo, useState, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow, useHandleConnections } from '@xyflow/react';
import { MoreHorizontal } from 'lucide-react';
import { TextNodeData } from '@/types/nodes';
import { useWorkflowStore } from '@/stores/workflow-store';
import { NodeContextMenu } from '../ui/NodeContextMenu';
import { RenameModal } from '../ui/RenameModal';

function TextNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as TextNodeData;
    const { updateNodeData, addNode, deleteNode } = useWorkflowStore();
    const { getNode } = useReactFlow();

    // Check connectivity for the handle attached to 'output'
    const connections = useHandleConnections({
        type: 'source',
        id: 'output',
    });
    const isConnected = connections.length > 0;

    // Local State
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

    // Actions
    const handleDuplicate = () => {
        const currentNode = getNode(id);
        if (currentNode) {
            addNode(
                'text',
                { x: currentNode.position.x + 50, y: currentNode.position.y + 50 },
                {
                    label: nodeData.label || 'Prompt',
                    text: nodeData.text
                }
            );
        }
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

    const isExecuting = nodeData.status === 'running';

    return (
        <>
            <div
                className={`
                    group relative rounded-2xl min-w-[460px] max-w-[600px] shadow-2xl transition-all duration-200
                    ${selected ? 'bg-[#2B2B2F] ring-2 ring-inset ring-[#333337]' : 'bg-[#212126]'}
                    ${isExecuting ? 'ring-2 ring-[#C084FC]/50' : ''}
                    ${nodeData.status === 'error' ? 'ring-2 ring-red-500' : ''}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4.5 pt-5 pb-[14px]">
                    <span
                        className="font-normal text-gray-200 text-[16px]"
                        style={{ fontFamily: 'var(--font-dm-sans)' }}
                    >
                        {nodeData.label || 'Prompt'}
                    </span>
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

                        {/* Context Menu anchored to the button */}
                        <NodeContextMenu
                            isOpen={isMenuOpen}
                            position={{ x: -10, y: -2 }} // Positioning to the right of the button
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
                <div className="px-4.5 pb-3">
                    <textarea
                        value={nodeData.text || ''}
                        onChange={(e) => updateNodeData(id, { text: e.target.value, output: e.target.value })}
                        onKeyDown={(e) => e.stopPropagation()}
                        placeholder="Your prompt goes here..."
                        className={`
                            w-full bg-[#353539] transition-colors rounded-lg p-6
                            text-[16px] font-[family-name:var(--font-dm-sans)] font-medium text-gray-100 placeholder-gray-500 
                            resize-none ring-1 ring-inset ring-[#3D3D41] 
                            min-h-[190px] leading-relaxed custom-scrollbar
                            ${nodeData.isLocked
                                ? 'cursor-not-allowed opacity-50 focus:outline-none'
                                : 'hover:bg-[#353539] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#3D3D41]'
                            }
                        `}
                        rows={4}
                        disabled={isExecuting || nodeData.isLocked}
                    />
                </div>

                {/* Handle Container */}
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
                            className={`!w-4 !h-4 !bg-[#2B2B2F] !border-[3.3px] !border-[#F1A0FA] transition-transform duration-200 hover:scale-100 flex items-center justify-center`}
                        >
                            {isConnected && (
                                <div className="w-1.5 h-1.5 bg-[#F1A0FA] rounded-full" />
                            )}
                        </Handle>
                    </div>

                    <div className={`
                        absolute left-full top-[0px] -translate-y-1/2 ml-2
                        flex items-center
                        transition-opacity duration-200
                        ${selected || 'group-hover:opacity-100 opacity-0'}
                    `}>
                        <span className="text-[#F1A0FA] font-medium text-[14px] whitespace-nowrap" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                            {nodeData.label || 'Prompt'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Rename Modal Portal */}
            <RenameModal
                isOpen={isRenameModalOpen}
                initialValue={nodeData.label || 'Prompt'}
                onClose={() => setIsRenameModalOpen(false)}
                onRename={handleRename}
            />
        </>
    );
}

export const TextNode = memo(TextNodeComponent);
