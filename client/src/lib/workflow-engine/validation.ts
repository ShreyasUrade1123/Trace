import { Node, Edge } from '@xyflow/react';
import { WorkflowNodeData, NodeType, NODE_CONFIG, HandleType } from '@/types/nodes';

/**
 * Validates if a connection between two nodes is valid
 * Checks type compatibility, existing connections, and cycle prevention
 */
export function isValidConnection(
    sourceNode: Node<WorkflowNodeData>,
    sourceHandle: string,
    targetNode: Node<WorkflowNodeData>,
    targetHandle: string,
    edges: Edge[]
): { valid: boolean; reason?: string } {
    // Cannot connect to self
    if (sourceNode.id === targetNode.id) {
        return { valid: false, reason: 'Cannot connect node to itself' };
    }

    // Get node configurations
    const sourceType = sourceNode.type as NodeType;
    const targetType = targetNode.type as NodeType;
    const sourceConfig = NODE_CONFIG[sourceType];
    const targetConfig = NODE_CONFIG[targetType];

    if (!sourceConfig || !targetConfig) {
        return { valid: false, reason: 'Unknown node type' };
    }

    // Find handle configurations
    const sourceOutput = sourceConfig.outputs.find(o => o.id === sourceHandle);
    const targetInput = targetConfig.inputs.find(i => i.id === targetHandle);

    if (!sourceOutput) {
        return { valid: false, reason: 'Invalid source handle' };
    }

    if (!targetInput) {
        return { valid: false, reason: 'Invalid target handle' };
    }

    // Type compatibility check
    if (!isTypeCompatible(sourceOutput.type, targetInput.type)) {
        return {
            valid: false,
            reason: `Type mismatch: cannot connect ${sourceOutput.type} to ${targetInput.type}`
        };
    }

    // Check if target input already has a connection (single input only for most handles)
    const existingConnection = edges.find(
        e => e.target === targetNode.id && e.targetHandle === targetHandle
    );

    // Allow multiple connections only for 'images' handle on LLM node
    if (existingConnection && targetHandle !== 'images') {
        return { valid: false, reason: 'Input handle already has a connection' };
    }

    // Check for cycles (DAG validation)
    if (wouldCreateCycle(sourceNode.id, targetNode.id, edges)) {
        return { valid: false, reason: 'Connection would create a cycle' };
    }

    return { valid: true };
}

/**
 * Check if source type is compatible with target type
 */
function isTypeCompatible(sourceType: HandleType, targetType: HandleType): boolean {
    // 'any' type accepts everything
    if (targetType === 'any') return true;

    // Exact match
    if (sourceType === targetType) return true;

    return false;
}

/**
 * Check if adding an edge from source to target would create a cycle
 * Uses BFS to find if there's already a path from target to source
 */
function wouldCreateCycle(sourceId: string, targetId: string, edges: Edge[]): boolean {
    const visited = new Set<string>();
    const queue = [targetId];

    while (queue.length > 0) {
        const current = queue.shift()!;

        // If we can reach the source from the target, adding this edge creates a cycle
        if (current === sourceId) {
            return true;
        }

        if (visited.has(current)) continue;
        visited.add(current);

        // Find all nodes that current connects to (outgoing edges)
        const outgoingEdges = edges.filter(e => e.source === current);
        queue.push(...outgoingEdges.map(e => e.target));
    }

    return false;
}

/**
 * Topological sort using Kahn's algorithm
 * Returns layers of nodes that can execute in parallel
 */
export function topologicalSort(
    nodes: Node<WorkflowNodeData>[],
    edges: Edge[]
): string[][] {
    const nodeIds = new Set(nodes.map(n => n.id));

    // Filter edges to only include those between the selected nodes
    const relevantEdges = edges.filter(
        e => nodeIds.has(e.source) && nodeIds.has(e.target)
    );

    // Calculate in-degree for each node
    const inDegree = new Map<string, number>();
    nodes.forEach(node => inDegree.set(node.id, 0));

    relevantEdges.forEach(edge => {
        const currentDegree = inDegree.get(edge.target) || 0;
        inDegree.set(edge.target, currentDegree + 1);
    });

    // Find all nodes with no incoming edges
    const layers: string[][] = [];
    let currentLayer = nodes
        .filter(node => (inDegree.get(node.id) || 0) === 0)
        .map(node => node.id);

    while (currentLayer.length > 0) {
        layers.push(currentLayer);
        const nextLayer: string[] = [];

        // Process current layer
        currentLayer.forEach(nodeId => {
            // Find all outgoing edges from this node
            relevantEdges
                .filter(e => e.source === nodeId)
                .forEach(edge => {
                    const targetDegree = inDegree.get(edge.target)! - 1;
                    inDegree.set(edge.target, targetDegree);

                    // If all dependencies satisfied, add to next layer
                    if (targetDegree === 0 && !nextLayer.includes(edge.target)) {
                        nextLayer.push(edge.target);
                    }
                });
        });

        currentLayer = nextLayer;
    }

    return layers;
}

/**
 * Get all upstream dependencies for a node
 */
export function getUpstreamNodes(
    nodeId: string,
    edges: Edge[]
): string[] {
    const upstream: string[] = [];
    const visited = new Set<string>();
    const queue = [nodeId];

    while (queue.length > 0) {
        const current = queue.shift()!;

        if (visited.has(current)) continue;
        visited.add(current);

        // Find all incoming edges
        const incomingEdges = edges.filter(e => e.target === current);
        incomingEdges.forEach(edge => {
            if (!upstream.includes(edge.source)) {
                upstream.push(edge.source);
                queue.push(edge.source);
            }
        });
    }

    return upstream;
}

/**
 * Get all downstream dependencies for a node
 */
export function getDownstreamNodes(
    nodeId: string,
    edges: Edge[]
): string[] {
    const downstream: string[] = [];
    const visited = new Set<string>();
    const queue = [nodeId];

    while (queue.length > 0) {
        const current = queue.shift()!;

        if (visited.has(current)) continue;
        visited.add(current);

        // Find all outgoing edges
        const outgoingEdges = edges.filter(e => e.source === current);
        outgoingEdges.forEach(edge => {
            if (!downstream.includes(edge.target)) {
                downstream.push(edge.target);
                queue.push(edge.target);
            }
        });
    }

    return downstream;
}

/**
 * Validate that a workflow is a valid DAG
 */
export function isValidDAG(nodes: Node<WorkflowNodeData>[], edges: Edge[]): boolean {
    const layers = topologicalSort(nodes, edges);
    const totalNodesInLayers = layers.reduce((sum, layer) => sum + layer.length, 0);

    // If not all nodes are in the sorted layers, there's a cycle
    return totalNodesInLayers === nodes.length;
}

/**
 * Get connected input values for a node
 */
export function getConnectedInputs(
    nodeId: string,
    nodes: Node<WorkflowNodeData>[],
    edges: Edge[]
): Record<string, unknown> {
    const inputs: Record<string, unknown> = {};

    // Find all incoming edges
    const incomingEdges = edges.filter(e => e.target === nodeId);

    incomingEdges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        if (sourceNode && edge.targetHandle) {
            // Get output from source node
            const output = sourceNode.data.output;

            // Handle 'images' input specially - collect multiple
            if (edge.targetHandle === 'images') {
                const currentImages = (inputs['images'] as string[]) || [];
                if (typeof output === 'string') {
                    currentImages.push(output);
                }
                inputs['images'] = currentImages;
            } else {
                inputs[edge.targetHandle] = output;
            }
        }
    });

    return inputs;
}
