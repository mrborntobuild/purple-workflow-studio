
import React from 'react';

export type NodeType = 
  | 'any_llm' | 'image_describer' | 'video_describer'
  | 'prompt_enhancer' | 'prompt_concatenator' | 'image' | 'text' | 'import' | 'export' 
  | 'preview' | 'levels' | 'compositor' | 'painter' 
  | 'crop' | 'resize' | 'blur' | 'invert' | 'channels' | 'video_frame'
  | 'number' | 'toggle' | 'list' | 'seed' | 'array'
  // Image Models
  | 'nano_banana_pro' | 'flux_pro_1_1_ultra' | 'flux_pro_1_1' | 'flux_dev' | 'flux_lora'
  | 'ideogram_v3' | 'ideogram_v3_edit' | 'imagen_3' | 'imagen_3_fast' | 'minimax_image'
  // Video Models
  | 'veo_2' | 'veo_2_i2v' | 'veo_3_1' | 'kling_2_6_pro' | 'kling_2_1_pro' | 'kling_2_0_master' 
  | 'kling_1_6_pro' | 'kling_1_6_standard' | 'hunyuan_video_v1_5_i2v' | 'hunyuan_video_v1_5_t2v' 
  | 'hunyuan_video_i2v' | 'luma_ray_2' | 'luma_ray_2_flash' | 'minimax_hailuo' | 'minimax_director' 
  | 'pika_2_2' | 'ltx_video' | 'wan_i2v'
  // Lip Sync
  | 'sad_talker'
  | 'kling_lipsync_a2v' | 'kling_lipsync_t2v' | 'sync_lipsync_v1' | 'sync_lipsync_v2' 
  | 'tavus_hummingbird' | 'latent_sync';

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
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
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
