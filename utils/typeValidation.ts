import { PortConfig } from '../components/nodes/BaseNode';
import { DataType, ConnectionValidation } from '../types';
import { getPortConfigForNode } from './portUtils';
import { NodeType } from '../types';

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







