
import React from 'react';

export type NodeType = 
  | 'any_llm' | 'basic_call' | 'image_describer' | 'video_describer'
  | 'prompt_enhancer' | 'prompt_concatenator' | 'image' | 'text' | 'import' | 'export' | 'file' 
  | 'preview' | 'levels' | 'compositor' | 'painter' 
  | 'crop' | 'resize' | 'blur' | 'invert' | 'channels' | 'video_frame'
  | 'number' | 'toggle' | 'list' | 'seed' | 'array' | 'options'
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

export type DataType = 'text' | 'image' | 'video' | 'audio' | 'mask' | '3d_model' | 'file';

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
  category: 'quick-access' | 'toolbox' | 'image-models' | 'video-models' | 'lip-sync' | 'upscaling' | '3d-gen' | 'audio-tts' | 'utility';
  subCategory?: string;
}
