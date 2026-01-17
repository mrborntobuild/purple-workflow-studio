import { NodeType, CanvasNode, Edge } from '../types';
import { PanelFieldType } from '../components/nodePanelConfig';
import { getPortConfigForNode } from './portUtils';

/**
 * Maps port label patterns to panel field types
 * This ensures any port can be mapped to the correct field
 */
const PORT_LABEL_TO_FIELD_MAP: Record<string, PanelFieldType> = {
  // Text/Prompt ports
  'PROMPT': 'prompt',
  'TEXT': 'prompt',
  'Prompt*': 'prompt',
  'Prompt': 'prompt',
  'System': 'prompt', // System prompt can map to prompt field
  
  // Image ports
  'IMAGE': 'image_url',
  'Image': 'image_url',
  'Media': 'image_url', // Media can be image
  
  // Video ports
  'VIDEO': 'image_url', // Video can be used as image input
  'Video': 'image_url',
  
  // Mask ports
  'MASK': 'mask_url',
  'Mask': 'mask_url',
  
  // Audio ports
  'AUDIO': 'image_url', // Audio might be used as media input
  'Audio': 'image_url',
  
  // File ports
  'FILE': 'image_url', // File might contain image
  'File': 'image_url',
};

/**
 * Maps port index to field type based on node type and port configuration
 * This handles cases where multiple ports of the same type exist
 */
export const getPortIndexToFieldMapping = (
  nodeType: NodeType,
  portIndex: number
): PanelFieldType | null => {
  const portConfig = getPortConfigForNode(nodeType);
  const inputPort = portConfig.inputs[portIndex];
  
  if (!inputPort) return null;
  
  const label = inputPort.label.toUpperCase();
  
  // Direct mapping from label
  if (PORT_LABEL_TO_FIELD_MAP[label]) {
    return PORT_LABEL_TO_FIELD_MAP[label];
  }
  
  // Pattern matching for variations
  if (label.includes('PROMPT') || label.includes('TEXT')) {
    return 'prompt';
  }
  if (label.includes('IMAGE')) {
    // First image port -> image_url, subsequent -> input_image_urls
    const imagePortIndices = portConfig.inputs
      .map((p, i) => p.label.toUpperCase().includes('IMAGE') ? i : -1)
      .filter(i => i !== -1);
    const imageIndex = imagePortIndices.indexOf(portIndex);
    return imageIndex === 0 ? 'image_url' : 'input_image_urls';
  }
  if (label.includes('VIDEO')) {
    return 'image_url'; // Video can be image input
  }
  if (label.includes('MASK')) {
    return 'mask_url';
  }
  if (label.includes('AUDIO')) {
    return 'image_url'; // Audio might be media
  }
  
  return null;
};

/**
 * Extracts value from a source node based on its output port
 * This handles all node types and their data structures
 */
export const extractValueFromSourceNode = (
  sourceNode: CanvasNode,
  sourcePortIndex: number
): any => {
  if (!sourceNode) return null;
  
  const portConfig = getPortConfigForNode(sourceNode.type);
  const outputPort = portConfig.outputs[sourcePortIndex];
  
  if (!outputPort) return null;
  
  const label = outputPort.label.toUpperCase();
  
  // Extract based on output port type
  if (label.includes('TEXT') || label.includes('PROMPT')) {
    // Text output - get from content
    return sourceNode.data.content || '';
  }
  
  if (label.includes('IMAGE')) {
    // Image output - get from imageUrl
    return sourceNode.data.imageUrl || '';
  }
  
  if (label.includes('VIDEO')) {
    // Video output - might be stored as imageUrl or videoUrl
    return sourceNode.data.imageUrl || sourceNode.data.videoUrl || '';
  }
  
  if (label.includes('AUDIO')) {
    // Audio output
    return sourceNode.data.audioUrl || sourceNode.data.imageUrl || '';
  }
  
  if (label.includes('MASK')) {
    // Mask output
    return sourceNode.data.maskUrl || sourceNode.data.imageUrl || '';
  }
  
  if (label.includes('3D') || label.includes('MODEL')) {
    // 3D model output
    return sourceNode.data.modelUrl || sourceNode.data.imageUrl || '';
  }
  
  if (label.includes('FILE') || label.includes('SVG')) {
    // File output
    return sourceNode.data.fileUrl || sourceNode.data.imageUrl || '';
  }
  
  if (label.includes('DATA')) {
    // Generic data output - try to get from content or number value
    if (sourceNode.type === 'number') {
      return sourceNode.data.content || sourceNode.data.value || '';
    }
    if (sourceNode.type === 'toggle') {
      return sourceNode.data.content || sourceNode.data.value || false;
    }
    if (sourceNode.type === 'list' || sourceNode.type === 'array') {
      return sourceNode.data.content || sourceNode.data.value || '[]';
    }
    return sourceNode.data.content || '';
  }
  
  // Fallback: try common data fields
  return sourceNode.data.content || 
         sourceNode.data.imageUrl || 
         sourceNode.data.value || 
         null;
};

/**
 * Gets the connected value for a specific input port
 */
export const getConnectedValueForPort = (
  targetNodeId: string,
  targetPortIndex: number,
  edges: Edge[],
  nodes: CanvasNode[]
): { value: any; sourceNodeId: string | null } => {
  // Find edge connected to this input port
  const inputEdge = edges.find(
    e => e.target === targetNodeId && e.targetPortIndex === targetPortIndex
  );
  
  if (!inputEdge) {
    return { value: null, sourceNodeId: null };
  }
  
  // Find the source node
  const sourceNode = nodes.find(n => n.id === inputEdge.source);
  if (!sourceNode) {
    return { value: null, sourceNodeId: null };
  }
  
  // Extract value from source node based on its output port
  const value = extractValueFromSourceNode(sourceNode, inputEdge.sourcePortIndex);
  
  return { value, sourceNodeId: sourceNode.id };
};

/**
 * Gets all connected values for a node, mapped to field types
 */
export const getConnectedValuesForNode = (
  node: CanvasNode,
  edges: Edge[],
  nodes: CanvasNode[]
): Record<PanelFieldType, { value: any; sourceNodeId: string | null; isConnected: boolean }> => {
  const result: Record<string, { value: any; sourceNodeId: string | null; isConnected: boolean }> = {};
  
  const portConfig = getPortConfigForNode(node.type);
  
  // Check each input port
  portConfig.inputs.forEach((inputPort, portIndex) => {
    const fieldType = getPortIndexToFieldMapping(node.type, portIndex);
    
    if (fieldType) {
      const { value, sourceNodeId } = getConnectedValueForPort(
        node.id,
        portIndex,
        edges,
        nodes
      );
      
      if (value !== null) {
        result[fieldType] = {
          value,
          sourceNodeId,
          isConnected: true
        };
      } else {
        result[fieldType] = {
          value: null,
          sourceNodeId: null,
          isConnected: false
        };
      }
    }
  });
  
  return result as Record<PanelFieldType, { value: any; sourceNodeId: string | null; isConnected: boolean }>;
};




