import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { nodeDefinitionService } from '../services/nodeDefinitionService';
import type {
  NodeDefinitions,
  DBNodeDefinition,
  DBNodeInput,
  DBNodeOutput,
  DBModelParameter,
  DBConnectionRule
} from '../types';

interface NodeDefinitionsContextValue extends NodeDefinitions {
  refresh: () => Promise<void>;
  getDefinition: (nodeType: string) => DBNodeDefinition | undefined;
  getInputs: (nodeType: string) => DBNodeInput[];
  getOutputs: (nodeType: string) => DBNodeOutput[];
  getParameters: (modelId: string) => DBModelParameter[];
  isNodeLive: (nodeType: string) => boolean;
  error: Error | null;
}

const defaultContext: NodeDefinitionsContextValue = {
  definitions: {},
  inputs: {},
  outputs: {},
  modelParameters: {},
  connectionRules: [],
  isLoaded: false,
  error: null,
  refresh: async () => {},
  getDefinition: () => undefined,
  getInputs: () => [],
  getOutputs: () => [],
  getParameters: () => [],
  isNodeLive: () => true
};

const NodeDefinitionsContext = createContext<NodeDefinitionsContextValue>(defaultContext);

export const useNodeDefinitions = () => {
  const context = useContext(NodeDefinitionsContext);
  if (!context) {
    throw new Error('useNodeDefinitions must be used within a NodeDefinitionsProvider');
  }
  return context;
};

interface NodeDefinitionsProviderProps {
  children: React.ReactNode;
}

export const NodeDefinitionsProvider: React.FC<NodeDefinitionsProviderProps> = ({ children }) => {
  const [definitions, setDefinitions] = useState<Record<string, DBNodeDefinition>>({});
  const [inputs, setInputs] = useState<Record<string, DBNodeInput[]>>({});
  const [outputs, setOutputs] = useState<Record<string, DBNodeOutput[]>>({});
  const [modelParameters, setModelParameters] = useState<Record<string, DBModelParameter[]>>({});
  const [connectionRules, setConnectionRules] = useState<DBConnectionRule[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadDefinitions = useCallback(async () => {
    try {
      console.log('🔵 [NodeDefinitionsContext] Loading node definitions...');
      setError(null);

      const data = await nodeDefinitionService.loadAll();

      setDefinitions(data.definitions);
      setInputs(data.inputs);
      setOutputs(data.outputs);
      setModelParameters(data.modelParameters);
      setConnectionRules(data.connectionRules);
      setIsLoaded(true);

      console.log('🟢 [NodeDefinitionsContext] Node definitions loaded successfully');
    } catch (err) {
      console.error('🔴 [NodeDefinitionsContext] Error loading node definitions:', err);
      setError(err instanceof Error ? err : new Error('Failed to load node definitions'));
      // Still mark as loaded so app can render (with fallbacks)
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadDefinitions();
  }, [loadDefinitions]);

  const refresh = useCallback(async () => {
    nodeDefinitionService.clearCache();
    await loadDefinitions();
  }, [loadDefinitions]);

  const getDefinition = useCallback(
    (nodeType: string): DBNodeDefinition | undefined => {
      return definitions[nodeType];
    },
    [definitions]
  );

  const getInputs = useCallback(
    (nodeType: string): DBNodeInput[] => {
      return inputs[nodeType] || [];
    },
    [inputs]
  );

  const getOutputs = useCallback(
    (nodeType: string): DBNodeOutput[] => {
      return outputs[nodeType] || [];
    },
    [outputs]
  );

  const getParameters = useCallback(
    (modelId: string): DBModelParameter[] => {
      return modelParameters[modelId] || [];
    },
    [modelParameters]
  );

  const isNodeLive = useCallback(
    (nodeType: string): boolean => {
      const def = definitions[nodeType];
      return def?.is_live ?? true;
    },
    [definitions]
  );

  const value: NodeDefinitionsContextValue = {
    definitions,
    inputs,
    outputs,
    modelParameters,
    connectionRules,
    isLoaded,
    error,
    refresh,
    getDefinition,
    getInputs,
    getOutputs,
    getParameters,
    isNodeLive
  };

  return (
    <NodeDefinitionsContext.Provider value={value}>
      {children}
    </NodeDefinitionsContext.Provider>
  );
};

export default NodeDefinitionsContext;
