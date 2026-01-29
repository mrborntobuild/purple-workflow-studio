import type { CanvasNode, Edge, ExecutionLog, DBWorkflowNode, DBWorkflowEdge } from '../types';

/**
 * Workflow Executor - Handles topological sorting and execution ordering
 */

export interface ExecutionLevel {
  level: number;
  nodeIds: string[];
}

export interface DependencyGraph {
  nodes: Map<string, {
    node: CanvasNode | DBWorkflowNode;
    dependencies: Set<string>;
    dependents: Set<string>;
  }>;
  edges: (Edge | DBWorkflowEdge)[];
}

/**
 * Build a dependency graph from nodes and edges
 */
export function buildDependencyGraph(
  nodes: (CanvasNode | DBWorkflowNode)[],
  edges: (Edge | DBWorkflowEdge)[]
): DependencyGraph {
  const graph: DependencyGraph = {
    nodes: new Map(),
    edges
  };

  // Initialize all nodes in the graph
  for (const node of nodes) {
    const nodeId = node.id;
    graph.nodes.set(nodeId, {
      node,
      dependencies: new Set(),
      dependents: new Set()
    });
  }

  // Build dependencies from edges
  for (const edge of edges) {
    const sourceId = 'source' in edge ? edge.source : edge.source_node_id;
    const targetId = 'target' in edge ? edge.target : edge.target_node_id;

    const sourceNode = graph.nodes.get(sourceId);
    const targetNode = graph.nodes.get(targetId);

    if (sourceNode && targetNode) {
      // Target depends on source
      targetNode.dependencies.add(sourceId);
      // Source has target as dependent
      sourceNode.dependents.add(targetId);
    }
  }

  return graph;
}

/**
 * Perform topological sort using Kahn's algorithm
 * Returns nodes grouped by execution level (parallel groups)
 */
export function topologicalSort(graph: DependencyGraph): ExecutionLevel[] {
  const levels: ExecutionLevel[] = [];
  const inDegree = new Map<string, number>();
  const remaining = new Set<string>();

  // Calculate initial in-degrees
  for (const [nodeId, nodeData] of graph.nodes) {
    inDegree.set(nodeId, nodeData.dependencies.size);
    remaining.add(nodeId);
  }

  let currentLevel = 0;

  while (remaining.size > 0) {
    // Find all nodes with no remaining dependencies
    const readyNodes: string[] = [];

    for (const nodeId of remaining) {
      if ((inDegree.get(nodeId) || 0) === 0) {
        readyNodes.push(nodeId);
      }
    }

    if (readyNodes.length === 0 && remaining.size > 0) {
      // Cycle detected - this shouldn't happen in a valid workflow
      console.error('🔴 [WorkflowExecutor] Cycle detected in workflow graph');
      throw new Error('Workflow contains a cycle and cannot be executed');
    }

    // Add ready nodes to current level
    levels.push({
      level: currentLevel,
      nodeIds: readyNodes
    });

    // Remove ready nodes and update in-degrees
    for (const nodeId of readyNodes) {
      remaining.delete(nodeId);
      const nodeData = graph.nodes.get(nodeId);

      if (nodeData) {
        for (const dependentId of nodeData.dependents) {
          const currentDegree = inDegree.get(dependentId) || 0;
          inDegree.set(dependentId, currentDegree - 1);
        }
      }
    }

    currentLevel++;
  }

  return levels;
}

/**
 * Get execution order as a flat array of node IDs
 */
export function getExecutionOrder(
  nodes: (CanvasNode | DBWorkflowNode)[],
  edges: (Edge | DBWorkflowEdge)[]
): string[] {
  const graph = buildDependencyGraph(nodes, edges);
  const levels = topologicalSort(graph);

  const order: string[] = [];
  for (const level of levels) {
    order.push(...level.nodeIds);
  }

  return order;
}

/**
 * Determine which nodes can be executed in parallel
 */
export function getParallelExecutionGroups(
  nodes: (CanvasNode | DBWorkflowNode)[],
  edges: (Edge | DBWorkflowEdge)[]
): ExecutionLevel[] {
  const graph = buildDependencyGraph(nodes, edges);
  return topologicalSort(graph);
}

/**
 * Check if a node is ready to execute (all dependencies completed)
 */
export function isNodeReady(
  nodeId: string,
  completedNodeIds: Set<string>,
  graph: DependencyGraph
): boolean {
  const nodeData = graph.nodes.get(nodeId);
  if (!nodeData) return false;

  for (const depId of nodeData.dependencies) {
    if (!completedNodeIds.has(depId)) {
      return false;
    }
  }

  return true;
}

/**
 * Get the nodes that should be executed next given completed nodes
 */
export function getNextExecutableNodes(
  completedNodeIds: Set<string>,
  runningNodeIds: Set<string>,
  graph: DependencyGraph
): string[] {
  const nextNodes: string[] = [];

  for (const [nodeId, nodeData] of graph.nodes) {
    // Skip if already completed or running
    if (completedNodeIds.has(nodeId) || runningNodeIds.has(nodeId)) {
      continue;
    }

    // Check if all dependencies are completed
    if (isNodeReady(nodeId, completedNodeIds, graph)) {
      nextNodes.push(nodeId);
    }
  }

  return nextNodes;
}

/**
 * Node type categories for execution handling
 */
export type NodeCategory =
  | 'input'       // text, image, file nodes - pass through data
  | 'generation'  // AI models - submit to FAL.ai
  | 'utility'     // Transform/process data
  | 'workflow'    // start_workflow, output - control flow
  | 'annotation'; // sticky_note, group - no execution

const NODE_CATEGORIES: Record<string, NodeCategory> = {
  // Input nodes
  'text': 'input',
  'image': 'input',
  'file': 'input',
  'number': 'input',
  'toggle': 'input',
  'seed': 'input',

  // Workflow nodes
  'start_workflow': 'workflow',
  'output': 'workflow',

  // Generation nodes (AI models)
  'nano_banana_pro': 'generation',
  'nano_banana_pro_edit': 'generation',
  'flux_pro_1_1_ultra': 'generation',
  'flux_pro_1_1': 'generation',
  'flux_dev': 'generation',
  'flux_lora': 'generation',
  'ideogram_v3': 'generation',
  'ideogram_v3_edit': 'generation',
  'imagen_3': 'generation',
  'imagen_3_fast': 'generation',
  'minimax_image': 'generation',
  'veo_2': 'generation',
  'veo_2_i2v': 'generation',
  'veo_3_1': 'generation',
  'kling_2_6_pro': 'generation',
  'kling_2_1_pro': 'generation',
  'kling_2_0_master': 'generation',
  'kling_1_6_pro': 'generation',
  'kling_1_6_standard': 'generation',
  'hunyuan_video_v1_5_i2v': 'generation',
  'hunyuan_video_v1_5_t2v': 'generation',
  'hunyuan_video_i2v': 'generation',
  'luma_ray_2': 'generation',
  'luma_ray_2_flash': 'generation',
  'minimax_hailuo': 'generation',
  'minimax_director': 'generation',
  'pika_2_2': 'generation',
  'ltx_video': 'generation',
  'wan_i2v': 'generation',
  'sad_talker': 'generation',
  'kling_lipsync_a2v': 'generation',
  'kling_lipsync_t2v': 'generation',
  'sync_lipsync_v1': 'generation',
  'sync_lipsync_v2': 'generation',
  'tavus_hummingbird': 'generation',
  'latent_sync': 'generation',
  'topaz_video': 'generation',
  'creative_upscaler': 'generation',
  'esrgan': 'generation',
  'thera': 'generation',
  'drct': 'generation',
  'trellis': 'generation',
  'hunyuan_3d_v2': 'generation',
  'hunyuan_3d_mini': 'generation',
  'hunyuan_3d_turbo': 'generation',
  'minimax_speech_hd': 'generation',
  'minimax_speech_turbo': 'generation',
  'kokoro_tts': 'generation',
  'dia_tts': 'generation',
  'elevenlabs_tts': 'generation',
  'elevenlabs_turbo': 'generation',
  'mmaudio_v2': 'generation',
  'background_remove': 'generation',
  'image_to_svg': 'generation',
  'speech_to_text': 'generation',
  'whisper': 'generation',
  'any_llm': 'generation',
  'basic_call': 'generation',
  'image_describer': 'generation',
  'video_describer': 'generation',
  'prompt_enhancer': 'generation',

  // Utility nodes
  'prompt_concatenator': 'utility',
  'import': 'utility',
  'export': 'utility',
  'preview': 'utility',
  'levels': 'utility',
  'compositor': 'utility',
  'painter': 'utility',
  'crop': 'utility',
  'resize': 'utility',
  'blur': 'utility',
  'invert': 'utility',
  'channels': 'utility',
  'video_frame': 'utility',
  'list': 'utility',
  'array': 'utility',
  'options': 'utility',
  'style_guide': 'utility',

  // Annotation nodes (no execution)
  'sticky_note': 'annotation',
  'group': 'annotation'
};

/**
 * Get the category of a node type
 */
export function getNodeCategory(nodeType: string): NodeCategory {
  return NODE_CATEGORIES[nodeType] || 'utility';
}

/**
 * Check if a node type requires async execution (FAL.ai)
 */
export function isAsyncNode(nodeType: string): boolean {
  return getNodeCategory(nodeType) === 'generation';
}

/**
 * Check if a node should be skipped during execution
 */
export function shouldSkipNode(nodeType: string): boolean {
  return getNodeCategory(nodeType) === 'annotation';
}

/**
 * Collect input data for a node from its dependencies
 */
export function collectNodeInputs(
  nodeId: string,
  graph: DependencyGraph,
  executionLogs: Map<string, ExecutionLog>,
  edges: (Edge | DBWorkflowEdge)[]
): Record<string, any> {
  const inputs: Record<string, any> = {};

  // Find all edges that target this node
  const incomingEdges = edges.filter(edge => {
    const targetId = 'target' in edge ? edge.target : edge.target_node_id;
    return targetId === nodeId;
  });

  for (const edge of incomingEdges) {
    const sourceId = 'source' in edge ? edge.source : edge.source_node_id;
    const sourceLog = executionLogs.get(sourceId);

    if (sourceLog?.output_data) {
      // Get the port index
      const sourcePortIndex = 'sourcePortIndex' in edge
        ? edge.sourcePortIndex
        : parseInt(edge.source_output_id, 10);
      const targetPortIndex = 'targetPortIndex' in edge
        ? edge.targetPortIndex
        : parseInt(edge.target_input_id, 10);

      // Use port index as key, or extract specific output
      const outputKey = `output_${sourcePortIndex}`;
      const inputKey = `input_${targetPortIndex}`;

      if (sourceLog.output_data[outputKey] !== undefined) {
        inputs[inputKey] = sourceLog.output_data[outputKey];
      } else if (sourceLog.output_data.result !== undefined) {
        // Fallback to generic result
        inputs[inputKey] = sourceLog.output_data.result;
      } else {
        // Use entire output data
        inputs[inputKey] = sourceLog.output_data;
      }
    }
  }

  return inputs;
}

/**
 * Validate workflow structure before execution
 */
export function validateWorkflowForExecution(
  nodes: (CanvasNode | DBWorkflowNode)[],
  edges: (Edge | DBWorkflowEdge)[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (nodes.length === 0) {
    errors.push('Workflow has no nodes');
    return { isValid: false, errors };
  }

  // Build graph and check for cycles
  try {
    const graph = buildDependencyGraph(nodes, edges);
    topologicalSort(graph);
  } catch (err) {
    errors.push('Workflow contains a cycle');
  }

  // Check for disconnected generation nodes (no inputs)
  const graph = buildDependencyGraph(nodes, edges);
  for (const [nodeId, nodeData] of graph.nodes) {
    const nodeType = 'type' in nodeData.node
      ? nodeData.node.type
      : (nodeData.node as DBWorkflowNode).node_type;

    if (getNodeCategory(nodeType) === 'generation') {
      // Generation nodes should have at least one input (prompt)
      if (nodeData.dependencies.size === 0) {
        // Check if node has inline content
        const node = nodeData.node as CanvasNode | DBWorkflowNode;
        const data = node.data as Record<string, any>;
        const hasInlinePrompt = data?.content || data?.panelSettings?.prompt;
        if (!hasInlinePrompt) {
          console.warn(`Node ${nodeId} (${nodeType}) has no inputs - will use panel settings`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================================================
// URL Detection Helpers
// ============================================================================

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v'];
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];

/**
 * Check if a URL points to an image
 */
export function isImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  // Check extension
  if (IMAGE_EXTENSIONS.some(ext => lower.includes(ext))) return true;
  // Check common image CDN patterns
  if (lower.includes('/images/') || lower.includes('image_url')) return true;
  // FAL.ai image patterns
  if (lower.includes('fal.media') && !lower.includes('.mp4')) return true;
  return false;
}

/**
 * Check if a URL points to a video
 */
export function isVideoUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  // Check extension
  if (VIDEO_EXTENSIONS.some(ext => lower.includes(ext))) return true;
  // Check common video CDN patterns
  if (lower.includes('/video/') || lower.includes('video_url')) return true;
  return false;
}

/**
 * Check if a URL points to audio
 */
export function isAudioUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  // Check extension
  if (AUDIO_EXTENSIONS.some(ext => lower.includes(ext))) return true;
  // Check common audio patterns
  if (lower.includes('/audio/') || lower.includes('audio_url')) return true;
  return false;
}

/**
 * Detect the output type from a value
 */
export function detectOutputType(value: any): 'image' | 'video' | 'audio' | 'text' | 'trigger' | 'unknown' {
  if (value === 'trigger' || value === true) return 'trigger';
  if (typeof value !== 'string') return 'unknown';
  if (isVideoUrl(value)) return 'video';
  if (isImageUrl(value)) return 'image';
  if (isAudioUrl(value)) return 'audio';
  // If it's a URL but we couldn't classify it, treat as unknown
  if (value.startsWith('http://') || value.startsWith('https://')) return 'unknown';
  // Otherwise it's probably text
  return 'text';
}

// ============================================================================
// Input Collection for Node Execution
// ============================================================================

export interface CollectedInputs {
  prompt?: string;
  image_url?: string;
  video_url?: string;
  audio_url?: string;
  inputs: Record<string, any>;
  inputTypes: Record<string, string>;
}

/**
 * Collect inputs for a node from completed upstream nodes using edge port indices
 */
export function collectInputsForNode(
  nodeId: string,
  edges: (Edge | DBWorkflowEdge)[],
  completedLogs: Map<string, { output_data?: Record<string, any>; node_type?: string }>
): CollectedInputs {
  const result: CollectedInputs = {
    inputs: {},
    inputTypes: {}
  };

  // Find all edges that target this node
  const incomingEdges = edges.filter(edge => {
    const targetId = 'target' in edge ? edge.target : edge.target_node_id;
    return targetId === nodeId;
  });

  for (const edge of incomingEdges) {
    const sourceId = 'source' in edge ? edge.source : edge.source_node_id;
    const sourceLog = completedLogs.get(sourceId);

    if (!sourceLog?.output_data) continue;

    // Get port indices from the edge
    const sourcePortIndex = 'sourcePortIndex' in edge
      ? edge.sourcePortIndex
      : parseInt(edge.source_output_id || '0', 10);
    const targetPortIndex = 'targetPortIndex' in edge
      ? edge.targetPortIndex
      : parseInt(edge.target_input_id || '0', 10);

    // Get the output value using source port index
    const outputKey = `output_${sourcePortIndex}`;
    let value = sourceLog.output_data[outputKey];

    // Fallback to result if output_N not found
    if (value === undefined) {
      value = sourceLog.output_data.result;
    }
    // Last resort: use the entire output_data
    if (value === undefined && Object.keys(sourceLog.output_data).length > 0) {
      // Try to find any output value
      const firstKey = Object.keys(sourceLog.output_data).find(k => k !== 'type' && k !== 'raw');
      if (firstKey) value = sourceLog.output_data[firstKey];
    }

    if (value === undefined) continue;

    // Store at target port index
    const inputKey = `input_${targetPortIndex}`;
    result.inputs[inputKey] = value;

    // Detect and classify the type
    const outputType = detectOutputType(value);
    result.inputTypes[inputKey] = outputType;

    // Classify into semantic inputs for generation nodes
    if (typeof value === 'string') {
      if (outputType === 'image' && !result.image_url) {
        result.image_url = value;
      } else if (outputType === 'video' && !result.video_url) {
        result.video_url = value;
      } else if (outputType === 'audio' && !result.audio_url) {
        result.audio_url = value;
      } else if (outputType === 'text' && !result.prompt) {
        result.prompt = value;
      }
    }
  }

  return result;
}
