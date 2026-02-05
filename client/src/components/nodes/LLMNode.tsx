'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow, useHandleConnections } from '@xyflow/react';
import { MoreHorizontal, Play, Plus, Asterisk, ArrowRight } from 'lucide-react';
import { LLMNodeData } from '@/types/nodes';
import { useWorkflowStore } from '@/stores/workflow-store';
import { NodeContextMenu } from '../ui/NodeContextMenu';

// Helper component for handles to ensure consistent styling and connection logic
const CustomHandle = ({
    id,
    type,
    position,
    color,
    label,
    icon,
    selected,
    isRing = true
}: {
    id: string,
    type: 'target' | 'source',
    position: Position,
    color: string,
    label: React.ReactNode,
    icon?: React.ReactNode,
    selected: boolean,
    isRing?: boolean
}) => {
    // Check connectivity for the handle
    const connections = useHandleConnections({
        type,
        id,
    });
    const isConnected = connections.length > 0;

    return (
        <div
            className={`
                absolute w-8 h-8 rounded-full flex items-center justify-center
                transition-colors duration-200 pointer-events-auto
                ${selected ? 'bg-[#2B2B2F]' : 'bg-[#212126]'}
            `}
            style={{
                [position === Position.Left ? 'left' : 'right']: '-16px', // -4 tailwind is -1rem = -16px? No, -4 is -1rem, wait. -4 is -16px.
                // In TextNode we used -right-4 which is -16px.
            }}
        >
            <div className="relative z-10 flex items-center justify-center">
                <Handle
                    type={type}
                    position={position}
                    id={id}
                    className={`
                        !w-4 !h-4 transition-transform duration-200 hover:scale-100 flex items-center justify-center
                        ${isRing
                            ? `!bg-[#2B2B2F] !border-[3.3px]`
                            : '!bg-transparent !border-0'
                        }
                    `}
                    style={{
                        borderColor: isRing ? color : undefined,
                        backgroundColor: !isRing ? 'transparent' : undefined
                    }}
                >
                    {/* Ring Inner Dot (Pink/Green/Purple) when connected */}
                    {(isConnected && isRing) && (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    )}

                    {/* Non-Ring Icon (like Asterisk) */}
                    {!isRing && icon}
                </Handle>
            </div>

            {/* Label */}
            <div className={`
                absolute top-0 -translate-y-1/2
                ${position === Position.Left ? 'right-full ml-2' : 'left-full mr-5'}
                flex items-center
                transition-opacity duration-200
                ${selected || 'group-hover:opacity-100 opacity-0'}
            `}>
                <span
                    className="font-medium text-[14px] whitespace-nowrap"
                    style={{
                        fontFamily: 'var(--font-dm-mono)',
                        color: color
                    }}
                >
                    {label}
                </span>
            </div>
        </div>
    );
};

function LLMNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as LLMNodeData;
    const { updateNodeData } = useWorkflowStore();
    const isExecuting = nodeData.status === 'running';
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleRunNode = async (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('Run node:', id);

        // Get current workflow state from the store
        const { nodes, edges, workflowId } = useWorkflowStore.getState();

        updateNodeData(id, { status: 'running', response: '' });

        try {
            const response = await fetch('/api/workflows/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workflowId: workflowId || 'temp',
                    nodes: nodes,
                    edges: edges,
                    scope: 'SINGLE',
                    nodeIds: [id],
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Execution failed');
            }

            // Find the result for this node
            const nodeResult = result.results?.find((r: { nodeId: string }) => r.nodeId === id);

            if (nodeResult?.status === 'SUCCESS') {
                updateNodeData(id, {
                    status: 'success',
                    response: nodeResult.output || 'No response generated',
                    output: nodeResult.output,
                });
            } else {
                throw new Error(nodeResult?.error || 'Node execution failed');
            }
        } catch (error) {
            console.error('LLM execution failed:', error);
            updateNodeData(id, {
                status: 'error',
                response: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
        }
    };

    return (
        <div
            className={`
                group relative rounded-xl min-w-[460px] max-w-[500px] shadow-2xl transition-all duration-200 bg-[#212126]
                ${selected ? 'ring-2 ring-inset ring-[#333337] bg-[#2B2B2F]' : ''}
                ${isExecuting ? 'ring-2 ring-[#E1E476]/50' : ''}
                ${nodeData.status === 'error' ? 'ring-2 ring-red-500' : ''}
            `}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-[18px] pt-5 pb-3">
                <span className="font-normal text-gray-200 text-[16px]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Any LLM
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
                    {/* Context Menu would go here */}
                    <NodeContextMenu
                        isOpen={isMenuOpen}
                        position={{ x: -10, y: -2 }}
                        onClose={() => setIsMenuOpen(false)}
                        onDuplicate={() => { }}
                        onRename={() => { }}
                        onLock={() => { }}
                        onDelete={() => { }}
                        isLocked={false}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="px-[18px] pb-0">
                <div className="relative group/input">
                    {nodeData.response ? (
                        <div className="
                            w-full bg-[#353539] rounded-xl p-5 min-h-[320px] 
                            text-[15px] leading-relaxed text-gray-300 font-normal
                            custom-scrollbar overflow-y-auto
                        ">
                            {nodeData.response}
                        </div>
                    ) : (
                        <textarea
                            value={nodeData.userMessage || ''}
                            onChange={(e) => updateNodeData(id, { userMessage: e.target.value })}
                            placeholder="The generated text will appear here"
                            className="
                                w-full bg-[#353539] rounded-lg p-6 min-h-[437px] 
                                text-[16px] font-medium text-gray-200 placeholder-brown-600 
                                resize-none focus:outline-none focus:ring-1 focus:ring-[#333337]
                                custom-scrollbar
                            " style={{ fontFamily: 'var(--font-dm-sans)' }}
                        />
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 pt-[10px] pb-[16px] flex items-center justify-between">
                <button className="flex items-center px-2.5 gap-0.5 text-white hover:text-gray-200 transition-colors group/btn">
                    <Plus className="w-5 h-5 stroke-[0.7px]" />
                    <span className="text-[12px] font-medium" style={{ fontFamily: 'var(--font-dm-sans)' }}>Add another image input</span>
                </button>

                <button
                    onClick={handleRunNode}
                    className="
                        flex justify-center px-3 py-[7px] 
                        bg-[#212126] hover:bg-[#363639] border-[0.5px] border-white/30
                        text-gray-200 text-[14px] font-medium rounded-lg transition-all
                    " style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                    <ArrowRight className="w-5 h-5 mr-0.5 stroke-[0.7px]" />
                    Run Model
                </button>
            </div>

            {/* Handles Container - Absolute positioned relative to card */}

            {/* 1. Prompt Handle (Top Left) */}
            <div className="absolute top-[80px]" style={{ left: 0 }}>
                <CustomHandle
                    id="user_message"
                    type="target"
                    position={Position.Left}
                    color="#A855F7" // Purple
                    label={<span>Prompt<span className="text-[#A855F7]">*</span></span>}
                    selected={selected || false}
                    isRing={false}
                    icon={
                        <div className="w-6 h-6 rounded-full bg-[#2B2B2F] flex items-center justify-center border-[3.3px] border-[#2B2B2F]">
                            <div className="w-4 h-4 rounded-full bg-[#A855F7] flex items-center justify-center">
                                <Asterisk className="w-6 h-6 text-black" />
                            </div>
                        </div>
                    }
                />
            </div>

            {/* 2. System Prompt Handle (Middle Left) */}
            <div className="absolute top-[140px]" style={{ left: 0 }}>
                <CustomHandle
                    id="system_prompt"
                    type="target"
                    position={Position.Left}
                    color="#F1A0FA" // Pink
                    label="System Prompt"
                    selected={selected || false}
                    isRing={true}
                />
            </div>

            {/* 3. Image Handle (Bottom Left) */}
            <div className="absolute top-[200px]" style={{ left: 0 }}>
                <CustomHandle
                    id="images"
                    type="target"
                    position={Position.Left}
                    color="#10B981" // Green
                    label="Image 1"
                    selected={selected || false}
                    isRing={true}
                />
            </div>

            {/* 4. Output Handle (Top Right) */}
            <div className="absolute top-[80px]" style={{ right: 0 }}>
                <CustomHandle
                    id="output"
                    type="source"
                    position={Position.Right}
                    color="#F1A0FA" // Pink
                    label="Text"
                    selected={selected || false}
                    isRing={true}
                />
            </div>

        </div >
    );
}

export const LLMNode = memo(LLMNodeComponent);
