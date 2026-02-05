import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';
import { WorkflowNodeData, NodeType, NODE_CONFIG } from '@/types/nodes';

// History state for undo/redo
interface HistoryState {
    nodes: Node<WorkflowNodeData>[];
    edges: Edge[];
}

interface WorkflowState {
    // Core state
    workflowId: string | null;
    workflowName: string;
    nodes: Node<WorkflowNodeData>[];
    edges: Edge[];

    // Selection state
    selectedNodeIds: string[];

    // Execution state
    isExecuting: boolean;
    executingNodeIds: string[];

    // History for undo/redo
    history: HistoryState[];
    historyIndex: number;

    // Actions
    setWorkflow: (id: string, name: string, nodes: Node<WorkflowNodeData>[], edges: Edge[]) => void;
    setWorkflowName: (name: string) => void;

    // Node actions
    addNode: (type: NodeType, position: { x: number; y: number }, initialData?: Partial<WorkflowNodeData>) => void;
    updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
    deleteNode: (nodeId: string) => void;
    onNodesChange: (changes: NodeChange[]) => void;

    // Edge actions
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    deleteEdge: (edgeId: string) => void;

    // Selection actions
    setSelectedNodeIds: (ids: string[]) => void;
    clearSelection: () => void;

    // Execution actions
    setExecuting: (isExecuting: boolean) => void;
    setNodeExecuting: (nodeId: string, isExecuting: boolean) => void;
    setNodeStatus: (nodeId: string, status: 'idle' | 'running' | 'success' | 'error', output?: unknown, error?: string) => void;
    resetNodeStatuses: () => void;

    // History actions
    undo: () => void;
    redo: () => void;
    saveToHistory: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;

    // Utility
    reset: () => void;
    getNodeById: (id: string) => Node<WorkflowNodeData> | undefined;
}

const generateNodeId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const initialState = {
    workflowId: null,
    workflowName: 'Untitled Workflow',
    nodes: [],
    edges: [],
    selectedNodeIds: [],
    isExecuting: false,
    executingNodeIds: [],
    history: [],
    historyIndex: -1,
};

export const useWorkflowStore = create<WorkflowState>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                setWorkflow: (id, name, nodes, edges) => {
                    set({
                        workflowId: id,
                        workflowName: name,
                        nodes,
                        edges,
                        history: [{ nodes, edges }],
                        historyIndex: 0,
                    });
                },

                setWorkflowName: (name) => set({ workflowName: name }),

                addNode: (type, position, initialData) => {
                    const config = NODE_CONFIG[type];
                    const newNode: Node<WorkflowNodeData> = {
                        id: generateNodeId(),
                        type,
                        position,
                        data: {
                            label: config.label,
                            status: 'idle',
                            // Type-specific defaults
                            ...(type === 'text' && { text: '' }),
                            ...(type === 'uploadImage' && { imageUrl: undefined, fileName: undefined }),
                            ...(type === 'uploadVideo' && { videoUrl: undefined, fileName: undefined }),
                            ...(type === 'llm' && { model: 'gemini-2.0-flash', systemPrompt: '', userMessage: '', images: [], response: '' }),
                            ...(type === 'cropImage' && { imageUrl: undefined, xPercent: 0, yPercent: 0, widthPercent: 100, heightPercent: 100 }),
                            ...(type === 'extractFrame' && { videoUrl: undefined, timestamp: '0' }),
                            // Override with initial data
                            ...initialData,
                        } as WorkflowNodeData,
                    };

                    set((state) => ({ nodes: [...state.nodes, newNode] }));
                    get().saveToHistory();
                },

                updateNodeData: (nodeId, data) => {
                    set((state) => ({
                        nodes: state.nodes.map((node) =>
                            node.id === nodeId
                                ? { ...node, data: { ...node.data, ...data } }
                                : node
                        ),
                    }));
                },

                deleteNode: (nodeId) => {
                    set((state) => ({
                        nodes: state.nodes.filter((n) => n.id !== nodeId),
                        edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
                        selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
                    }));
                    get().saveToHistory();
                },

                onNodesChange: (changes) => {
                    set((state) => ({
                        nodes: applyNodeChanges(changes, state.nodes as unknown as Node[]) as unknown as Node<WorkflowNodeData>[],
                    }));
                },

                onEdgesChange: (changes) => {
                    set((state) => ({
                        edges: applyEdgeChanges(changes, state.edges),
                    }));
                },

                onConnect: (connection) => {
                    if (!connection.source || !connection.target) return;

                    const newEdge: Edge = {
                        id: `edge_${connection.source}_${connection.target}_${Date.now()}`,
                        source: connection.source,
                        target: connection.target,
                        sourceHandle: connection.sourceHandle || 'output',
                        targetHandle: connection.targetHandle || 'input',
                        animated: false,
                        style: { stroke: '#F1A0FA', strokeWidth: 4 },
                        markerEnd: 'dot',
                    };

                    set((state) => ({
                        edges: addEdge(newEdge, state.edges),
                    }));
                    get().saveToHistory();
                },

                deleteEdge: (edgeId) => {
                    set((state) => ({
                        edges: state.edges.filter((e) => e.id !== edgeId),
                    }));
                    get().saveToHistory();
                },

                setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),
                clearSelection: () => set({ selectedNodeIds: [] }),

                setExecuting: (isExecuting) => set({ isExecuting }),

                setNodeExecuting: (nodeId, isExecuting) => {
                    set((state) => ({
                        executingNodeIds: isExecuting
                            ? [...state.executingNodeIds, nodeId]
                            : state.executingNodeIds.filter((id) => id !== nodeId),
                    }));
                },

                setNodeStatus: (nodeId, status, output, error) => {
                    set((state) => ({
                        nodes: state.nodes.map((node) =>
                            node.id === nodeId
                                ? {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        status,
                                        ...(output !== undefined && { output }),
                                        ...(error !== undefined && { error }),
                                    }
                                }
                                : node
                        ),
                    }));
                },

                resetNodeStatuses: () => {
                    set((state) => ({
                        nodes: state.nodes.map((node) => ({
                            ...node,
                            data: { ...node.data, status: 'idle' as const, error: undefined },
                        })),
                        executingNodeIds: [],
                    }));
                },

                saveToHistory: () => {
                    const { nodes, edges, history, historyIndex } = get();
                    const newHistory = history.slice(0, historyIndex + 1);
                    newHistory.push({ nodes: [...nodes], edges: [...edges] });

                    // Keep only last 50 history states
                    if (newHistory.length > 50) {
                        newHistory.shift();
                    }

                    set({
                        history: newHistory,
                        historyIndex: newHistory.length - 1,
                    });
                },

                undo: () => {
                    const { history, historyIndex } = get();
                    if (historyIndex > 0) {
                        const prevState = history[historyIndex - 1];
                        set({
                            nodes: prevState.nodes,
                            edges: prevState.edges,
                            historyIndex: historyIndex - 1,
                        });
                    }
                },

                redo: () => {
                    const { history, historyIndex } = get();
                    if (historyIndex < history.length - 1) {
                        const nextState = history[historyIndex + 1];
                        set({
                            nodes: nextState.nodes,
                            edges: nextState.edges,
                            historyIndex: historyIndex + 1,
                        });
                    }
                },

                canUndo: () => get().historyIndex > 0,
                canRedo: () => get().historyIndex < get().history.length - 1,

                reset: () => set(initialState),

                getNodeById: (id) => get().nodes.find((n) => n.id === id),
            }),
            {
                name: 'weavy-workflow-store',
                partialize: (state) => ({
                    workflowId: state.workflowId,
                    workflowName: state.workflowName,
                    nodes: state.nodes,
                    edges: state.edges,
                }),
            }
        ),
        { name: 'WorkflowStore' }
    )
);
