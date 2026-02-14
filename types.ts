
import React from 'react';

export type NodeType =
  | 'any_llm' | 'basic_call' | 'image_describer' | 'video_describer'
  | 'prompt_enhancer' | 'prompt_concatenator' | 'image' | 'text' | 'import' | 'export' | 'file'
  | 'preview' | 'levels' | 'compositor' | 'painter'
  | 'crop' | 'resize' | 'blur' | 'invert' | 'channels' | 'video_frame'
  | 'number' | 'toggle' | 'list' | 'seed' | 'array' | 'options'
  // Workflow nodes
  | 'start_workflow' | 'output'
  // Image Models
  | 'nano_banana_pro' | 'nano_banana_pro_edit' | 'flux_pro_1_1_ultra' | 'flux_pro_1_1' | 'flux_dev' | 'flux_lora'
  | 'ideogram_v3' | 'ideogram_v3_edit' | 'imagen_3' | 'imagen_3_fast' | 'minimax_image'
  // Video Models
  | 'veo_2' | 'veo_2_i2v' | 'veo_3_1' | 'kling_2_6_pro' | 'kling_2_1_pro' | 'kling_2_0_master' 
  | 'kling_1_6_pro' | 'kling_1_6_standard' | 'hunyuan_video_v1_5_i2v' | 'hunyuan_video_v1_5_t2v' 
  | 'hunyuan_video_i2v' | 'luma_ray_2' | 'luma_ray_2_flash' | 'minimax_hailuo' | 'minimax_director' 
  | 'pika_2_2' | 'ltx_video' | 'wan_i2v'
  // Lip Sync
  | 'sad_talker'
  | 'kling_lipsync_a2v' | 'kling_lipsync_t2v' | 'sync_lipsync_v1' | 'sync_lipsync_v2' 
  | 'tavus_hummingbird' | 'latent_sync'
  // Upscaling & Enhancement
  | 'topaz_video' | 'creative_upscaler' | 'esrgan' | 'thera' | 'drct'
  // 3D Generation
  | 'trellis' | 'hunyuan_3d_v2' | 'hunyuan_3d_mini' | 'hunyuan_3d_turbo'
  // Audio / TTS
  | 'minimax_speech_hd' | 'minimax_speech_turbo' | 'kokoro_tts' | 'dia_tts' | 'elevenlabs_tts' | 'elevenlabs_turbo' | 'mmaudio_v2'
  // Utility
  | 'background_remove' | 'image_to_svg' | 'speech_to_text' | 'whisper'
  // Annotation
  | 'sticky_note'
  | 'style_guide'
  | 'group';

export interface NodePosition {
  x: number;
  y: number;
}

export interface CanvasNode {
  id: string;
  type: NodeType;
  position: NodePosition;
  data: {
    label: string;
    content?: string;
    imageUrl?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    status?: 'idle' | 'loading' | 'error' | 'success';
    jobId?: string;
    usedModel?: string;
    progress?: number;
    noteColor?: 'yellow' | 'pink' | 'blue' | 'green' | 'purple'; // For sticky notes
    noteWidth?: number; // For sticky notes - width in pixels
    noteHeight?: number; // For sticky notes - height in pixels
    panelSettings?: {
      prompt?: string; // Prompt text saved from Right Panel
      seed?: string;
      seedRandom?: boolean;
      imageSize?: string;
      imageUrl?: string;
      tailImageUrl?: string;
      inputImageUrls?: string;
      maskUrl?: string;
      imageUrls?: string;
      aspectRatio?: string;
      duration?: string;
      resolution?: string;
      negativePrompt?: string;
      enhancePrompt?: boolean;
      generateAudio?: boolean;
      cfgScale?: number | string;
      guidanceScale?: number | string;
      numInferenceSteps?: number | string;
      numFrames?: number | string;
      enablePromptExpansion?: boolean;
      i2vStability?: boolean;
      loop?: boolean;
      promptOptimizer?: boolean;
      expandPrompt?: boolean;
      framesPerSecond?: number | string;
      guideScale?: number | string;
      shift?: number | string;
      enableSafetyChecker?: boolean;
      acceleration?: string;
      numImages?: number | string;
      outputFormat?: string;
      syncMode?: boolean;
      safetyTolerance?: string;
      imagePromptStrength?: number | string;
      raw?: boolean;
      limitGenerations?: boolean;
      enableWebSearch?: boolean;
      loras?: string;
      renderingSpeed?: string;
      colorPalette?: string;
      styleCodes?: string;
      style?: string;
      stylePreset?: string;
      runs?: number;
      imageInputCount?: number;
      textInputPortCount?: number; // For prompt_concatenator dynamic ports
      manualText?: string; // For prompt_concatenator manual text
      mediaInputCount?: number; // For any_llm dynamic media ports
      layerCount?: number; // For style_guide dynamic layers
    };
    parentId?: string; // For grouping
    extent?: 'parent'; // To constrain child nodes to parent
    width?: number; // For group node dimensions
    height?: number; // For group node dimensions
  };
}

export type DataType = 'text' | 'image' | 'video' | 'audio' | 'mask' | '3d_model' | 'file' | 'trigger';

export interface ConnectionValidation {
  isValid: boolean;
  reason?: string;
  outputType?: DataType;
  inputType?: DataType;
}

export interface Edge {
  id: string;
  source: string;
  sourcePortIndex: number;
  target: string;
  targetPortIndex: number;
}

export interface ViewState {
  x: number;
  y: number;
  zoom: number;
}

export interface SidebarItem {
  id: NodeType;
  label: string;
  icon: React.ReactNode;
  category: 'quick-access' | 'toolbox' | 'image-models' | 'video-models' | 'lip-sync' | 'upscaling' | '3d-gen' | 'audio-tts' | 'utility' | 'workflow';
  subCategory?: string;
}

// Database-aligned types for normalized storage

export interface DBWorkflowNode {
  id: string;
  workflow_id: string;
  node_type: string;
  position_x: number;
  position_y: number;
  data: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface DBWorkflowEdge {
  id: string;
  workflow_id: string;
  source_node_id: string;
  source_output_id: string;
  target_node_id: string;
  target_input_id: string;
  created_at?: string;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  user_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  total_nodes: number;
  completed_nodes: number;
  created_at: string;
}

export interface ExecutionLog {
  id: string;
  run_id: string;
  workflow_node_id: string;
  node_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  input_data?: Record<string, any>;
  output_data?: Record<string, any>;
  job_id?: string;
  job_model?: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  execution_order: number;
  created_at: string;
  // Joined fields
  node_label?: string;
}

// Node Definition types (from database config tables)

export interface DBNodeDefinition {
  id: string;
  node_type: string;
  label: string;
  description?: string;
  icon?: string;
  category: string;
  sub_category?: string;
  is_live: boolean;
  created_at?: string;
}

export interface DBNodeInput {
  id: string;
  node_type: string;
  input_id: string;
  label: string;
  input_type: string;
  required: boolean;
  optional_label?: string;
  placeholder?: string;
  supports_multiple?: boolean;
  order_index: number;
}

export interface DBNodeOutput {
  id: string;
  node_type: string;
  output_id: string;
  label: string;
  output_type: string;
  order_index: number;
}

export interface DBModelParameter {
  id: string;
  model_id: string;
  parameter_key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'toggle' | 'slider';
  default_value?: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  order_index: number;
}

export interface DBConnectionRule {
  id: string;
  source_type: string;
  source_output_index: number;
  target_type: string;
  target_input_index: number;
  is_allowed: boolean;
}

export interface NodeDefinitions {
  definitions: Record<string, DBNodeDefinition>;
  inputs: Record<string, DBNodeInput[]>;
  outputs: Record<string, DBNodeOutput[]>;
  modelParameters: Record<string, DBModelParameter[]>;
  connectionRules: DBConnectionRule[];
  isLoaded: boolean;
}
