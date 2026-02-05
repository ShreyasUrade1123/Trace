'use client';

import { useCallback, useRef, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
    ReactFlow,
    ReactFlowProvider,
    MiniMap,
    Background,
    BackgroundVariant,
    Connection,
    useReactFlow,
    Panel,
    SelectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from '@/components/nodes';
import { useWorkflowStore } from '@/stores/workflow-store';
import { useCanvasToolStore } from '@/stores/canvas-tool-store';
import { isValidConnection as validateConnection } from '@/lib/workflow-engine/validation';
import { NodeType } from '@/types/nodes';
import FloatingToolbar from '@/components/workflow/FloatingToolbar';

function WorkflowCanvasInner() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow();
    const params = useParams();
    const workflowId = params?.id?.[0] as string | undefined;
    const [isExecuting, setIsExecuting] = useState(false);

    // Tool state
    const activeTool = useCanvasToolStore((state) => state.activeTool);

    const nodes = useWorkflowStore((state) => state.nodes);
    const edges = useWorkflowStore((state) => state.edges);
    const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
    const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
    const onConnect = useWorkflowStore((state) => state.onConnect);
    const addNode = useWorkflowStore((state) => state.addNode);
    const deleteNode = useWorkflowStore((state) => state.deleteNode);
    const setSelectedNodeIds = useWorkflowStore((state) => state.setSelectedNodeIds);
    const selectedNodeIds = useWorkflowStore((state) => state.selectedNodeIds);
    const undo = useWorkflowStore((state) => state.undo);
    const redo = useWorkflowStore((state) => state.redo);
    const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

    /**
     * React Flow interaction props based on active tool
     * 
     * SELECT MODE (Arrow):
     * - panOnDrag: false (don't pan when dragging)
     * - selectionOnDrag: true (create selection box when dragging on empty canvas)
     * - panOnScroll: true (2-finger trackpad scroll pans)
     * - zoomOnPinch: true (2-finger pinch zooms)
     * - Nodes are selectable and draggable
     * 
     * PAN MODE (Hand):
     * - panOnDrag: true (drag anywhere to pan)
     * - selectionOnDrag: false (no selection box)
     * - panOnScroll: true (2-finger trackpad scroll pans)
     * - zoomOnPinch: true (2-finger pinch zooms)
     * - Nodes are not selectable/draggable
     */
    const interactionProps = useMemo(() => {
        if (activeTool === 'pan') {
            return {
                panOnDrag: true,           // Drag to pan
                selectionOnDrag: false,    // No selection box
                nodesDraggable: false,     // Cannot move nodes
                nodesConnectable: false,   // Cannot create connections
                elementsSelectable: false, // Cannot select nodes
            };
        }
        // Select mode
        return {
            panOnDrag: false,              // Don't pan on drag
            selectionOnDrag: true,         // Create selection box on drag
            nodesDraggable: true,          // Can move nodes
            nodesConnectable: true,        // Can create connections
            elementsSelectable: true,      // Can select nodes
        };
    }, [activeTool]);

    // Handle workflow execution
    const handleRun = useCallback(async (scope: 'full' | 'selected' | 'single') => {
        setIsExecuting(true);

        // Set all nodes to running state
        const nodesToRun = scope === 'full' ? nodes : nodes.filter(n => selectedNodeIds.includes(n.id));
        nodesToRun.forEach(node => {
            updateNodeData(node.id, { status: 'running' });
        });

        try {
            const response = await fetch('/api/workflows/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workflowId: workflowId || 'temp',
                    nodes,
                    edges,
                    scope: scope.toUpperCase(),
                    nodeIds: scope !== 'full' ? selectedNodeIds : undefined,
                }),
            });

            if (!response.ok) {
                throw new Error('Execution failed');
            }

            const result = await response.json();

            // Update node statuses based on results
            result.results?.forEach((nodeResult: { nodeId: string; status: string; output?: unknown; error?: string }) => {
                updateNodeData(nodeResult.nodeId, {
                    status: nodeResult.status === 'SUCCESS' ? 'success' : 'error',
                    output: nodeResult.output,
                    error: nodeResult.error,
                });
            });

            console.log('Execution completed:', result);
        } catch (error) {
            console.error('Execution error:', error);
            // Reset all nodes to error state
            nodesToRun.forEach(node => {
                updateNodeData(node.id, { status: 'error' });
            });
        } finally {
            setIsExecuting(false);
        }
    }, [workflowId, nodes, edges, selectedNodeIds, updateNodeData]);

    // Validate connection before allowing it
    const handleConnect = useCallback(
        (connection: Connection) => {
            if (!connection.source || !connection.target) return;

            const sourceNode = nodes.find(n => n.id === connection.source);
            const targetNode = nodes.find(n => n.id === connection.target);

            if (!sourceNode || !targetNode) return;

            const validation = validateConnection(
                sourceNode,
                connection.sourceHandle || 'output',
                targetNode,
                connection.targetHandle || 'input',
                edges
            );

            if (validation.valid) {
                onConnect(connection);
            } else {
                console.warn('Invalid connection:', validation.reason);
            }
        },
        [nodes, edges, onConnect]
    );

    // Handle drag and drop from sidebar
    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow') as NodeType;

            if (!type || !reactFlowWrapper.current) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            addNode(type, position);
        },
        [screenToFlowPosition, addNode]
    );

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            // Delete nodes
            if (event.key === 'Delete' || event.key === 'Backspace') {
                const selectedNodes = nodes.filter(n => n.selected);
                selectedNodes.forEach(node => deleteNode(node.id));
            }

            // Run full workflow (Cmd/Ctrl + R)
            if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
                event.preventDefault();
                handleRun('full');
            }

            // Undo (Cmd/Ctrl + Z)
            if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
                event.preventDefault();
                undo();
            }

            // Redo (Cmd/Ctrl + Shift + Z)
            if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'z') {
                event.preventDefault();
                redo();
            }
        },
        [nodes, deleteNode, handleRun, undo, redo]
    );

    // Handle selection change
    const handleSelectionChange = useCallback(
        ({ nodes: selectedNodes }: { nodes: typeof nodes }) => {
            setSelectedNodeIds(selectedNodes.map(n => n.id));
        },
        [setSelectedNodeIds]
    );

    return (
        <div
            ref={reactFlowWrapper}
            className="flex-1 h-full"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleConnect}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onSelectionChange={handleSelectionChange}
                nodeTypes={nodeTypes}
                fitView
                snapToGrid
                snapGrid={[16, 16]}
                minZoom={0.1}
                maxZoom={4}
                defaultEdgeOptions={{
                    animated: false,
                    style: { stroke: '#F1A0FA', strokeWidth: 4 },
                    markerEnd: 'dot',
                }}
                connectionLineStyle={{ stroke: '#F1A0FA', strokeWidth: 4 }}
                proOptions={{ hideAttribution: true }}
                className="bg-gray-950"
                // Interaction props based on active tool
                {...interactionProps}
                // Always enabled regardless of tool
                panOnScroll={true}         // 2-finger trackpad scroll to pan
                zoomOnScroll={false}       // Disable scroll wheel zoom (use pinch instead)
                zoomOnPinch={true}         // 2-finger pinch to zoom
                zoomOnDoubleClick={true}   // Double-click to zoom
                selectionMode={SelectionMode.Partial} // Select if partially in box
                // Selection box styling
                selectionKeyCode={null}    // No key required for selection (just drag)
            >
                <svg style={{ position: 'absolute', top: 0, left: 0, height: 0, width: 0, pointerEvents: 'none' }}>
                    <defs>
                        <marker
                            id="dot"
                            viewBox="0 0 10 10"
                            refX="5"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto-start-reverse"
                        >
                            <circle cx="5" cy="5" r="5" fill="#F1A0FA" />
                        </marker>
                    </defs>
                </svg>
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="#374151"
                />
                <MiniMap
                    nodeColor={(node) => {
                        switch (node.type) {
                            case 'text': return '#3b82f6';
                            case 'uploadImage': return '#8b5cf6';
                            case 'uploadVideo': return '#ec4899';
                            case 'llm': return '#10b981';
                            case 'cropImage': return '#f59e0b';
                            case 'extractFrame': return '#ef4444';
                            default: return '#6b7280';
                        }
                    }}
                    className="bg-gray-800 border-gray-700"
                    maskColor="rgba(0, 0, 0, 0.5)"
                />
                <Panel position="bottom-center">
                    <FloatingToolbar onRun={handleRun} isExecuting={isExecuting} />
                </Panel>
            </ReactFlow>
        </div>
    );
}

export function WorkflowCanvas() {
    return (
        <ReactFlowProvider>
            <WorkflowCanvasInner />
        </ReactFlowProvider>
    );
}
