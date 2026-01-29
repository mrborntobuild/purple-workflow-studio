import { PortConfig } from '../components/nodes/BaseNode';
import { DataType, ConnectionValidation, NodeType } from '../types';
import { getPortConfigForNode } from './portUtils';

// Re-export DataType for convenience
export type { DataType };

/**
 * Core validation logic - extracts data type from port configuration
 * This is the single source of truth for determining port types
 */
export const getDataTypeFromPort = (port: PortConfig): DataType => {
  // If explicit dataType is provided, use it (highest priority)
  if (port.dataType) {
    return port.dataType;
  }
  
  // Otherwise, fall back to label parsing for backward compatibility
  const label = port.label.toUpperCase();
  
  // Text types (Purple/Pink)
  if (label.includes('TEXT') || label.includes('PROMPT') || label.includes('SYSTEM')) {
    return 'text';
  }
  
  // Image types (Blue/Green)
  if (label.includes('IMAGE') || label.includes('FRAME')) {
    return 'image';
  }
  
  // Video types (Red)
  if (label.includes('VIDEO')) {
    return 'video';
  }
  
  // Audio types (Amber/Yellow)
  if (label.includes('AUDIO')) {
    return 'audio';
  }
  
  // Mask types (Cyan/Teal)
  if (label.includes('MASK')) {
    return 'mask';
  }
  
  // 3D Model types
  if (label.includes('3D') || (label.includes('MODEL') && !label.includes('IMAGE'))) {
    return '3d_model';
  }
  
  // File types (Gray)
  if (label.includes('SVG') || label.includes('FILE')) {
    return 'file';
  }

  // Trigger types (Green) - for workflow connections
  if (label.includes('TRIGGER')) {
    return 'trigger';
  }

  return 'text'; // Default fallback
};

/**
 * Validates if two ports can be connected
 * Returns validation result with type information
 */
export const validatePortConnection = (
  outputPort: PortConfig,
  inputPort: PortConfig
): ConnectionValidation => {
  const outputType = getDataTypeFromPort(outputPort);
  const inputType = getDataTypeFromPort(inputPort);
  
  if (outputType === inputType) {
    return {
      isValid: true,
      outputType,
      inputType
    };
  }
  
  return {
    isValid: false,
    reason: `Cannot connect ${outputType} to ${inputType}`,
    outputType,
    inputType
  };
};

/**
 * Checks if a node type has compatible input ports for a given output type
 * Used for filtering NodePicker to show only compatible nodes
 */
export const hasCompatibleInputPort = (
  nodeType: NodeType,
  sourceOutputType: DataType
): boolean => {
  const portConfig = getPortConfigForNode(nodeType);
  
  if (portConfig.inputs.length === 0) {
    return false;
  }
  
  return portConfig.inputs.some(inputPort => {
    const inputType = getDataTypeFromPort(inputPort);
    return inputType === sourceOutputType;
  });
};

/**
 * Finds the first compatible input port index for a given output type
 * Returns -1 if no compatible port is found
 */
export const findCompatibleInputPortIndex = (
  nodeType: NodeType,
  sourceOutputType: DataType
): number => {
  const portConfig = getPortConfigForNode(nodeType);

  for (let i = 0; i < portConfig.inputs.length; i++) {
    const inputPort = portConfig.inputs[i];
    const inputType = getDataTypeFromPort(inputPort);
    if (inputType === sourceOutputType) {
      return i;
    }
  }

  return -1; // No compatible port found
};

/**
 * Validates workflow-specific connections
 * start_workflow can only connect to text and file nodes
 * output node can accept connections from any node with output
 */
export const validateWorkflowConnection = (
  sourceNodeType: NodeType,
  targetNodeType: NodeType
): ConnectionValidation => {
  // Start workflow can only connect to text or file nodes (triggers)
  if (sourceNodeType === 'start_workflow') {
    // Also disallow connecting directly to output
    if (targetNodeType === 'output') {
      return {
        isValid: false,
        reason: 'Cannot connect Start Workflow directly to Output'
      };
    }
    const validTargets: NodeType[] = ['text', 'basic_call', 'file'];
    if (!validTargets.includes(targetNodeType)) {
      return {
        isValid: false,
        reason: 'Start Workflow can only connect to Text or File nodes'
      };
    }
    return { isValid: true };
  }

  // Output node accepts connections from most nodes with outputs
  if (targetNodeType === 'output') {
    // start_workflow case already handled above
    return { isValid: true };
  }

  // For non-workflow connections, use default validation
  return { isValid: true };
};

/**
 * Check if a node type is a valid trigger for workflow mode
 */
export const isValidTriggerNode = (nodeType: NodeType): boolean => {
  return nodeType === 'text' || nodeType === 'basic_call' || nodeType === 'file';
};







