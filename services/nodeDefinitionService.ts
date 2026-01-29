import { supabase } from './supabaseClient';
import type {
  DBNodeDefinition,
  DBNodeInput,
  DBNodeOutput,
  DBModelParameter,
  DBConnectionRule
} from '../types';

/**
 * Service for fetching node definitions from Supabase database tables.
 * Replaces hardcoded node type configurations with database-driven definitions.
 */
class NodeDefinitionService {
  private cache: {
    definitions: Record<string, DBNodeDefinition> | null;
    inputs: Record<string, DBNodeInput[]> | null;
    outputs: Record<string, DBNodeOutput[]> | null;
    modelParameters: Record<string, DBModelParameter[]> | null;
    connectionRules: DBConnectionRule[] | null;
    lastFetched: number | null;
  } = {
    definitions: null,
    inputs: null,
    outputs: null,
    modelParameters: null,
    connectionRules: null,
    lastFetched: null
  };

  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  /**
   * Check if cache is valid
   */
  private isCacheValid(): boolean {
    if (!this.cache.lastFetched) return false;
    return Date.now() - this.cache.lastFetched < this.cacheExpiry;
  }

  /**
   * Clear the cache to force refetch
   */
  clearCache(): void {
    this.cache = {
      definitions: null,
      inputs: null,
      outputs: null,
      modelParameters: null,
      connectionRules: null,
      lastFetched: null
    };
    console.log('🔵 [NodeDefinitionService] Cache cleared');
  }

  /**
   * Fetch all node definitions from the node_definitions table
   */
  async getNodeDefinitions(): Promise<Record<string, DBNodeDefinition>> {
    if (this.cache.definitions && this.isCacheValid()) {
      return this.cache.definitions;
    }

    console.log('🔵 [NodeDefinitionService] Fetching node definitions...');

    const { data, error } = await supabase
      .from('node_definitions')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('🔴 [NodeDefinitionService] Error fetching node definitions:', error);
      throw error;
    }

    // Index by node_type for quick lookup
    const definitions: Record<string, DBNodeDefinition> = {};
    for (const def of data || []) {
      definitions[def.node_type] = {
        id: def.id,
        node_type: def.node_type,
        label: def.label,
        description: def.description,
        icon: def.icon,
        category: def.category,
        sub_category: def.sub_category,
        is_live: def.is_live ?? true,
        created_at: def.created_at
      };
    }

    this.cache.definitions = definitions;
    this.cache.lastFetched = Date.now();

    console.log('🟢 [NodeDefinitionService] Loaded', Object.keys(definitions).length, 'node definitions');
    return definitions;
  }

  /**
   * Fetch input port definitions for a specific node type
   */
  async getNodeInputs(nodeType: string): Promise<DBNodeInput[]> {
    // First check cache
    if (this.cache.inputs && this.cache.inputs[nodeType] && this.isCacheValid()) {
      return this.cache.inputs[nodeType];
    }

    console.log('🔵 [NodeDefinitionService] Fetching inputs for:', nodeType);

    const { data, error } = await supabase
      .from('node_inputs')
      .select('*')
      .eq('node_type', nodeType)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('🔴 [NodeDefinitionService] Error fetching node inputs:', error);
      throw error;
    }

    const inputs: DBNodeInput[] = (data || []).map(inp => ({
      id: inp.id,
      node_type: inp.node_type,
      input_id: inp.input_id,
      label: inp.label,
      input_type: inp.input_type,
      required: inp.required ?? false,
      optional_label: inp.optional_label,
      placeholder: inp.placeholder,
      supports_multiple: inp.supports_multiple,
      order_index: inp.order_index
    }));

    // Update cache
    if (!this.cache.inputs) this.cache.inputs = {};
    this.cache.inputs[nodeType] = inputs;

    return inputs;
  }

  /**
   * Fetch all node inputs at once (more efficient for initial load)
   */
  async getAllNodeInputs(): Promise<Record<string, DBNodeInput[]>> {
    if (this.cache.inputs && this.isCacheValid()) {
      return this.cache.inputs;
    }

    console.log('🔵 [NodeDefinitionService] Fetching all node inputs...');

    const { data, error } = await supabase
      .from('node_inputs')
      .select('*')
      .order('node_type', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) {
      console.error('🔴 [NodeDefinitionService] Error fetching all node inputs:', error);
      throw error;
    }

    const inputs: Record<string, DBNodeInput[]> = {};
    for (const inp of data || []) {
      if (!inputs[inp.node_type]) {
        inputs[inp.node_type] = [];
      }
      inputs[inp.node_type].push({
        id: inp.id,
        node_type: inp.node_type,
        input_id: inp.input_id,
        label: inp.label,
        input_type: inp.input_type,
        required: inp.required ?? false,
        optional_label: inp.optional_label,
        placeholder: inp.placeholder,
        supports_multiple: inp.supports_multiple,
        order_index: inp.order_index
      });
    }

    this.cache.inputs = inputs;
    console.log('🟢 [NodeDefinitionService] Loaded inputs for', Object.keys(inputs).length, 'node types');
    return inputs;
  }

  /**
   * Fetch output port definitions for a specific node type
   */
  async getNodeOutputs(nodeType: string): Promise<DBNodeOutput[]> {
    // First check cache
    if (this.cache.outputs && this.cache.outputs[nodeType] && this.isCacheValid()) {
      return this.cache.outputs[nodeType];
    }

    console.log('🔵 [NodeDefinitionService] Fetching outputs for:', nodeType);

    const { data, error } = await supabase
      .from('node_outputs')
      .select('*')
      .eq('node_type', nodeType)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('🔴 [NodeDefinitionService] Error fetching node outputs:', error);
      throw error;
    }

    const outputs: DBNodeOutput[] = (data || []).map(out => ({
      id: out.id,
      node_type: out.node_type,
      output_id: out.output_id,
      label: out.label,
      output_type: out.output_type,
      order_index: out.order_index
    }));

    // Update cache
    if (!this.cache.outputs) this.cache.outputs = {};
    this.cache.outputs[nodeType] = outputs;

    return outputs;
  }

  /**
   * Fetch all node outputs at once (more efficient for initial load)
   */
  async getAllNodeOutputs(): Promise<Record<string, DBNodeOutput[]>> {
    if (this.cache.outputs && this.isCacheValid()) {
      return this.cache.outputs;
    }

    console.log('🔵 [NodeDefinitionService] Fetching all node outputs...');

    const { data, error } = await supabase
      .from('node_outputs')
      .select('*')
      .order('node_type', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) {
      console.error('🔴 [NodeDefinitionService] Error fetching all node outputs:', error);
      throw error;
    }

    const outputs: Record<string, DBNodeOutput[]> = {};
    for (const out of data || []) {
      if (!outputs[out.node_type]) {
        outputs[out.node_type] = [];
      }
      outputs[out.node_type].push({
        id: out.id,
        node_type: out.node_type,
        output_id: out.output_id,
        label: out.label,
        output_type: out.output_type,
        order_index: out.order_index
      });
    }

    this.cache.outputs = outputs;
    console.log('🟢 [NodeDefinitionService] Loaded outputs for', Object.keys(outputs).length, 'node types');
    return outputs;
  }

  /**
   * Fetch model-specific UI parameters
   */
  async getModelParameters(modelId: string): Promise<DBModelParameter[]> {
    // First check cache
    if (this.cache.modelParameters && this.cache.modelParameters[modelId] && this.isCacheValid()) {
      return this.cache.modelParameters[modelId];
    }

    console.log('🔵 [NodeDefinitionService] Fetching parameters for model:', modelId);

    const { data, error } = await supabase
      .from('model_parameters')
      .select('*')
      .eq('model_id', modelId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('🔴 [NodeDefinitionService] Error fetching model parameters:', error);
      throw error;
    }

    const params: DBModelParameter[] = (data || []).map(p => ({
      id: p.id,
      model_id: p.model_id,
      parameter_key: p.parameter_key,
      label: p.label,
      type: p.type,
      default_value: p.default_value,
      options: p.options,
      min: p.min,
      max: p.max,
      step: p.step,
      order_index: p.order_index
    }));

    // Update cache
    if (!this.cache.modelParameters) this.cache.modelParameters = {};
    this.cache.modelParameters[modelId] = params;

    return params;
  }

  /**
   * Fetch all model parameters at once
   */
  async getAllModelParameters(): Promise<Record<string, DBModelParameter[]>> {
    if (this.cache.modelParameters && this.isCacheValid()) {
      return this.cache.modelParameters;
    }

    console.log('🔵 [NodeDefinitionService] Fetching all model parameters...');

    const { data, error } = await supabase
      .from('model_parameters')
      .select('*')
      .order('model_id', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) {
      console.error('🔴 [NodeDefinitionService] Error fetching all model parameters:', error);
      throw error;
    }

    const params: Record<string, DBModelParameter[]> = {};
    for (const p of data || []) {
      if (!params[p.model_id]) {
        params[p.model_id] = [];
      }
      params[p.model_id].push({
        id: p.id,
        model_id: p.model_id,
        parameter_key: p.parameter_key,
        label: p.label,
        type: p.type,
        default_value: p.default_value,
        options: p.options,
        min: p.min,
        max: p.max,
        step: p.step,
        order_index: p.order_index
      });
    }

    this.cache.modelParameters = params;
    console.log('🟢 [NodeDefinitionService] Loaded parameters for', Object.keys(params).length, 'models');
    return params;
  }

  /**
   * Fetch valid connection rules
   */
  async getConnectionRules(): Promise<DBConnectionRule[]> {
    if (this.cache.connectionRules && this.isCacheValid()) {
      return this.cache.connectionRules;
    }

    console.log('🔵 [NodeDefinitionService] Fetching connection rules...');

    const { data, error } = await supabase
      .from('node_connection_rules')
      .select('*');

    if (error) {
      console.error('🔴 [NodeDefinitionService] Error fetching connection rules:', error);
      throw error;
    }

    const rules: DBConnectionRule[] = (data || []).map(r => ({
      id: r.id,
      source_type: r.source_type,
      source_output_index: r.source_output_index,
      target_type: r.target_type,
      target_input_index: r.target_input_index,
      is_allowed: r.is_allowed ?? true
    }));

    this.cache.connectionRules = rules;
    console.log('🟢 [NodeDefinitionService] Loaded', rules.length, 'connection rules');
    return rules;
  }

  /**
   * Fetch node statuses (live/not_live flags)
   */
  async getNodeStatuses(): Promise<Record<string, boolean>> {
    const definitions = await this.getNodeDefinitions();
    const statuses: Record<string, boolean> = {};

    for (const [nodeType, def] of Object.entries(definitions)) {
      statuses[nodeType] = def.is_live;
    }

    return statuses;
  }

  /**
   * Load all node configuration data at once (for initial app load)
   */
  async loadAll(): Promise<{
    definitions: Record<string, DBNodeDefinition>;
    inputs: Record<string, DBNodeInput[]>;
    outputs: Record<string, DBNodeOutput[]>;
    modelParameters: Record<string, DBModelParameter[]>;
    connectionRules: DBConnectionRule[];
  }> {
    console.log('🔵 [NodeDefinitionService] Loading all node configuration...');

    const [definitions, inputs, outputs, modelParameters, connectionRules] = await Promise.all([
      this.getNodeDefinitions(),
      this.getAllNodeInputs(),
      this.getAllNodeOutputs(),
      this.getAllModelParameters(),
      this.getConnectionRules()
    ]);

    console.log('🟢 [NodeDefinitionService] All configuration loaded');

    return {
      definitions,
      inputs,
      outputs,
      modelParameters,
      connectionRules
    };
  }

  /**
   * Check if a connection is valid based on rules
   */
  async isConnectionValid(
    sourceType: string,
    sourceOutputIndex: number,
    targetType: string,
    targetInputIndex: number
  ): Promise<boolean> {
    const rules = await this.getConnectionRules();

    // If there are specific rules, check them
    const matchingRule = rules.find(
      r =>
        r.source_type === sourceType &&
        r.source_output_index === sourceOutputIndex &&
        r.target_type === targetType &&
        r.target_input_index === targetInputIndex
    );

    if (matchingRule) {
      return matchingRule.is_allowed;
    }

    // If no specific rule, check data type compatibility
    const outputs = await this.getNodeOutputs(sourceType);
    const inputs = await this.getNodeInputs(targetType);

    const sourceOutput = outputs.find(o => o.order_index === sourceOutputIndex);
    const targetInput = inputs.find(i => i.order_index === targetInputIndex);

    if (!sourceOutput || !targetInput) {
      return false;
    }

    // Types must match (or be compatible)
    return sourceOutput.output_type === targetInput.input_type;
  }
}

export const nodeDefinitionService = new NodeDefinitionService();
