import { NodeType } from '../types';

export type PanelFieldType = 
  | 'prompt' 
  | 'image_url'
  | 'tail_image_url'
  | 'input_image_urls'
  | 'mask_url'
  | 'image_urls'
  | 'aspect_ratio' 
  | 'duration' 
  | 'resolution'
  | 'negative_prompt' 
  | 'enhance_prompt' 
  | 'generate_audio'
  | 'cfg_scale'
  | 'guidance_scale'
  | 'num_inference_steps'
  | 'num_frames'
  | 'enable_prompt_expansion'
  | 'i2v_stability'
  | 'loop'
  | 'prompt_optimizer'
  | 'expand_prompt'
  | 'frames_per_second'
  | 'guide_scale'
  | 'shift'
  | 'enable_safety_checker'
  | 'acceleration'
  | 'num_images'
  | 'output_format'
  | 'sync_mode'
  | 'safety_tolerance'
  | 'image_prompt_strength'
  | 'raw'
  | 'limit_generations'
  | 'enable_web_search'
  | 'loras'
  | 'rendering_speed'
  | 'color_palette'
  | 'style_codes'
  | 'style'
  | 'style_preset'
  | 'seed' 
  | 'image_size'
  | 'runs'
  | 'seedRandom'; // Special field for seed random checkbox

export interface PanelFieldConfig {
  type: PanelFieldType;
  label: string;
  required?: boolean;
  dataType: 'string' | 'number' | 'boolean';
  options?: string[]; // For dropdowns/selects
  placeholder?: string;
}

export type NodePanelConfig = {
  [key in NodeType]?: PanelFieldConfig[];
};

// Configuration for which fields each node type should have
export const NODE_PANEL_CONFIG: NodePanelConfig = {
  // Video Models - Veo 2 (Text-to-Video)
  'veo_2': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '16:9', '9:16', 'auto'] },
    { type: 'duration', label: 'Duration', required: false, dataType: 'string', options: ['Default', '5s', '6s', '7s', '8s'] },
    { type: 'negative_prompt', label: 'Negative Prompt', required: false, dataType: 'string', placeholder: 'Enter negative prompt...' },
    { type: 'enhance_prompt', label: 'Enhance Prompt', required: false, dataType: 'boolean' },
    { type: 'seed', label: 'Seed', required: false, dataType: 'string' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Veo 2 I2V (Image-to-Video)
  'veo_2_i2v': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_url', label: 'Image URL', required: true, dataType: 'string', placeholder: 'Enter image URL (jpg, jpeg, png, webp, gif, avif)...' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', 'auto', 'auto_prefer_portrait', '16:9', '9:16'] },
    { type: 'duration', label: 'Duration', required: false, dataType: 'string', options: ['Default', '5s', '6s', '7s', '8s'] },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Veo 3.1 (Image-to-Video)
  'veo_3_1': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt (supports multi-line and dialogue)...' },
    { type: 'image_url', label: 'Image URL', required: true, dataType: 'string', placeholder: 'Enter image URL (jpg, jpeg, png, webp, gif, avif)...' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', 'auto', '16:9', '9:16'] },
    { type: 'duration', label: 'Duration', required: false, dataType: 'string', options: ['Default', '4s', '6s', '8s'] },
    { type: 'resolution', label: 'Resolution', required: false, dataType: 'string', options: ['Default', '720p', '1080p'] },
    { type: 'generate_audio', label: 'Generate Audio', required: false, dataType: 'boolean' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Kling 2.6 Pro (Text-to-Video / Image-to-Video)
  'kling_2_6_pro': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt (supports dialogue/quotes)...' },
    { type: 'image_url', label: 'Image URL', required: false, dataType: 'string', placeholder: 'Optional: Enter image URL for image-to-video...' },
    { type: 'duration', label: 'Duration', required: false, dataType: 'string', options: ['Default', '5', '10'] },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '16:9', '9:16', '1:1'] },
    { type: 'negative_prompt', label: 'Negative Prompt', required: false, dataType: 'string', placeholder: 'Enter negative prompt...' },
    { type: 'cfg_scale', label: 'CFG Scale', required: false, dataType: 'number', placeholder: '0.0-1.0 (default 0.5)' },
    { type: 'seed', label: 'Seed', required: false, dataType: 'string', placeholder: 'Random seed for reproducibility' },
    { type: 'generate_audio', label: 'Generate Audio', required: false, dataType: 'boolean' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Kling 2.1 Pro (Image-to-Video)
  'kling_2_1_pro': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_url', label: 'Image URL', required: false, dataType: 'string', placeholder: 'Optional: Enter image URL for image-to-video...' },
    { type: 'duration', label: 'Duration', required: false, dataType: 'string', options: ['Default', '5', '10'] },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '16:9', '9:16', '1:1'] },
    { type: 'negative_prompt', label: 'Negative Prompt', required: false, dataType: 'string', placeholder: 'Enter negative prompt...' },
    { type: 'cfg_scale', label: 'CFG Scale', required: false, dataType: 'number', placeholder: '0.0-1.0 (default 0.5)' },
    { type: 'seed', label: 'Seed', required: false, dataType: 'string', placeholder: 'Random seed for reproducibility' },
    { type: 'tail_image_url', label: 'Tail Image URL', required: false, dataType: 'string', placeholder: 'End frame image URL...' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Kling 2.0 Master (Text-to-Video / Image-to-Video)
  'kling_2_0_master': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_url', label: 'Image URL', required: false, dataType: 'string', placeholder: 'Optional: Enter image URL for image-to-video...' },
    { type: 'duration', label: 'Duration', required: false, dataType: 'string', options: ['Default', '5', '10'] },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '16:9', '9:16', '1:1'] },
    { type: 'negative_prompt', label: 'Negative Prompt', required: false, dataType: 'string', placeholder: 'Enter negative prompt...' },
    { type: 'cfg_scale', label: 'CFG Scale', required: false, dataType: 'number', placeholder: '0.0-1.0 (default 0.5)' },
    { type: 'seed', label: 'Seed', required: false, dataType: 'string', placeholder: 'Random seed for reproducibility' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Kling 1.6 Pro (Image-to-Video)
  'kling_1_6_pro': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_url', label: 'Image URL', required: false, dataType: 'string', placeholder: 'Optional: Enter image URL for image-to-video...' },
    { type: 'duration', label: 'Duration', required: false, dataType: 'string', options: ['Default', '5', '10'] },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '16:9', '9:16', '1:1'] },
    { type: 'negative_prompt', label: 'Negative Prompt', required: false, dataType: 'string', placeholder: 'Enter negative prompt...' },
    { type: 'cfg_scale', label: 'CFG Scale', required: false, dataType: 'number', placeholder: '0.0-1.0 (default 0.5)' },
    { type: 'seed', label: 'Seed', required: false, dataType: 'string', placeholder: 'Random seed for reproducibility' },
    { type: 'tail_image_url', label: 'Tail Image URL', required: false, dataType: 'string', placeholder: 'End frame image URL...' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Kling 1.6 Standard (Text-to-Video / Image-to-Video)
  'kling_1_6_standard': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_url', label: 'Image URL', required: false, dataType: 'string', placeholder: 'Optional: Enter image URL for image-to-video...' },
    { type: 'duration', label: 'Duration', required: false, dataType: 'string', options: ['Default', '5', '10'] },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '16:9', '9:16', '1:1'] },
    { type: 'negative_prompt', label: 'Negative Prompt', required: false, dataType: 'string', placeholder: 'Enter negative prompt...' },
    { type: 'cfg_scale', label: 'CFG Scale', required: false, dataType: 'number', placeholder: '0.0-1.0 (default 0.5)' },
    { type: 'seed', label: 'Seed', required: false, dataType: 'string', placeholder: 'Random seed for reproducibility' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Hunyuan Video V1.5 I2V
  'hunyuan_video_v1_5_i2v': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_url', label: 'Image URL', required: false, dataType: 'string', placeholder: 'Enter image URL...' },
    { type: 'negative_prompt', label: 'Negative Prompt', required: false, dataType: 'string', placeholder: 'Enter negative prompt...' },
    { type: 'num_inference_steps', label: 'Num Inference Steps', required: false, dataType: 'number', placeholder: 'Enter number...' },
    { type: 'seed', label: 'Seed', required: false, dataType: 'string' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '16:9', '9:16'] },
    { type: 'resolution', label: 'Resolution', required: false, dataType: 'string', options: ['Default', '480p'] },
    { type: 'num_frames', label: 'Num Frames', required: false, dataType: 'number', placeholder: 'Enter number...' },
    { type: 'enable_prompt_expansion', label: 'Enable Prompt Expansion', required: false, dataType: 'boolean' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Hunyuan Video V1.5 T2V
  'hunyuan_video_v1_5_t2v': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'negative_prompt', label: 'Negative Prompt', required: false, dataType: 'string', placeholder: 'Enter negative prompt...' },
    { type: 'num_inference_steps', label: 'Num Inference Steps', required: false, dataType: 'number', placeholder: 'Enter number...' },
    { type: 'seed', label: 'Seed', required: false, dataType: 'string' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '16:9', '9:16'] },
    { type: 'resolution', label: 'Resolution', required: false, dataType: 'string', options: ['Default', '480p'] },
    { type: 'num_frames', label: 'Num Frames', required: false, dataType: 'number', placeholder: 'Enter number...' },
    { type: 'enable_prompt_expansion', label: 'Enable Prompt Expansion', required: false, dataType: 'boolean' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Hunyuan Video I2V
  'hunyuan_video_i2v': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_url', label: 'Image URL', required: true, dataType: 'string', placeholder: 'Enter image URL...' },
    { type: 'seed', label: 'Seed', required: false, dataType: 'string' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '16:9', '9:16'] },
    { type: 'resolution', label: 'Resolution', required: false, dataType: 'string', options: ['Default', '720p'] },
    { type: 'num_frames', label: 'Num Frames', required: false, dataType: 'number', placeholder: '129' },
    { type: 'i2v_stability', label: 'I2V Stability', required: false, dataType: 'boolean' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Luma Ray 2
  'luma_ray_2': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '16:9', '9:16', '4:3', '3:4', '21:9', '9:21'] },
    { type: 'loop', label: 'Loop', required: false, dataType: 'boolean' },
    { type: 'resolution', label: 'Resolution', required: false, dataType: 'string', options: ['Default', '540p', '720p', '1080p'] },
    { type: 'duration', label: 'Duration', required: false, dataType: 'string', options: ['Default', '5s', '9s'] },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Luma Ray 2 Flash
  'luma_ray_2_flash': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '16:9', '9:16', '4:3', '3:4', '21:9', '9:21'] },
    { type: 'loop', label: 'Loop', required: false, dataType: 'boolean' },
    { type: 'resolution', label: 'Resolution', required: false, dataType: 'string', options: ['Default', '540p', '720p', '1080p'] },
    { type: 'duration', label: 'Duration', required: false, dataType: 'string', options: ['Default', '5s', '9s'] },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Minimax Hailuo
  'minimax_hailuo': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_url', label: 'Image URL', required: true, dataType: 'string', placeholder: 'Enter image URL...' },
    { type: 'prompt_optimizer', label: 'Prompt Optimizer', required: false, dataType: 'boolean' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Minimax Director
  'minimax_director': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt (supports camera movements in [brackets])...' },
    { type: 'image_url', label: 'Image URL', required: true, dataType: 'string', placeholder: 'Enter image URL...' },
    { type: 'prompt_optimizer', label: 'Prompt Optimizer', required: false, dataType: 'boolean' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Pika 2.2
  'pika_2_2': [
    { type: 'image_url', label: 'Image URL', required: true, dataType: 'string', placeholder: 'Enter image URL...' },
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'seed', label: 'Seed', required: false, dataType: 'string' },
    { type: 'negative_prompt', label: 'Negative Prompt', required: false, dataType: 'string', placeholder: 'Enter negative prompt...' },
    { type: 'resolution', label: 'Resolution', required: false, dataType: 'string', options: ['Default', '720p', '1080p'] },
    { type: 'duration', label: 'Duration', required: false, dataType: 'string', options: ['Default', '5', '10'] },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - LTX Video
  'ltx_video': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_url', label: 'Image URL', required: false, dataType: 'string', placeholder: 'Enter image URL...' },
    { type: 'negative_prompt', label: 'Negative Prompt', required: false, dataType: 'string', placeholder: 'Enter negative prompt...' },
    { type: 'resolution', label: 'Resolution', required: false, dataType: 'string', options: ['Default', '480p', '720p'] },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '9:16', '16:9'] },
    { type: 'seed', label: 'Seed', required: false, dataType: 'string' },
    { type: 'num_inference_steps', label: 'Num Inference Steps', required: false, dataType: 'number', placeholder: 'Enter number...' },
    { type: 'expand_prompt', label: 'Expand Prompt', required: false, dataType: 'boolean' },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Video Models - Wan I2V
  'wan_i2v': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_url', label: 'Image URL', required: false, dataType: 'string', placeholder: 'Enter image URL...' },
    { type: 'negative_prompt', label: 'Negative Prompt', required: false, dataType: 'string', placeholder: 'Enter negative prompt...' },
    { type: 'num_frames', label: 'Num Frames', required: false, dataType: 'number', placeholder: '81-100' },
    { type: 'frames_per_second', label: 'Frames Per Second', required: false, dataType: 'number', placeholder: '5-24' },
    { type: 'seed', label: 'Seed', required: false, dataType: 'string' },
    { type: 'resolution', label: 'Resolution', required: false, dataType: 'string', options: ['Default', '480p', '720p'] },
    { type: 'num_inference_steps', label: 'Num Inference Steps', required: false, dataType: 'number', placeholder: 'Enter number...' },
    { type: 'guide_scale', label: 'Guide Scale', required: false, dataType: 'number', placeholder: 'Enter number...' },
    { type: 'shift', label: 'Shift', required: false, dataType: 'number', placeholder: 'Enter number...' },
    { type: 'enable_safety_checker', label: 'Enable Safety Checker', required: false, dataType: 'boolean' },
    { type: 'enable_prompt_expansion', label: 'Enable Prompt Expansion', required: false, dataType: 'boolean' },
    { type: 'acceleration', label: 'Acceleration', required: false, dataType: 'string', options: ['Default', 'none', 'regular'] },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', 'auto', '16:9', '9:16', '1:1'] },
    { type: 'runs', label: 'Runs', required: false, dataType: 'number' },
  ],
  // Image Models - Nano Banana Pro
  'nano_banana_pro': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', 'auto', '1:1', '21:9', '16:9', '3:2', '4:3', '5:4', '4:5', '3:4', '2:3', '9:16'] },
    { type: 'output_format', label: 'Output Format', required: false, dataType: 'string', options: ['Default', 'png'] },
    { type: 'resolution', label: 'Resolution', required: false, dataType: 'string', options: ['Default', '1K', '2K', '4K'] },
  ],
  // Image Models - Nano Banana Pro Edit
  'nano_banana_pro_edit': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', 'auto', '1:1', '21:9', '16:9', '3:2', '4:3', '5:4', '4:5', '3:4', '2:3', '9:16'] },
    { type: 'output_format', label: 'Output Format', required: false, dataType: 'string', options: ['Default', 'png'] },
    { type: 'resolution', label: 'Resolution', required: false, dataType: 'string', options: ['Default', '1K', '2K', '4K'] },
    { type: 'sync_mode', label: 'Sync Mode', required: false, dataType: 'boolean' },
    { type: 'limit_generations', label: 'Limit Generations', required: false, dataType: 'boolean' },
    { type: 'enable_web_search', label: 'Enable Web Search', required: false, dataType: 'boolean' },
  ],
  // Image Models - Flux Pro 1.1 Ultra
  'flux_pro_1_1_ultra': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '16:9', '4:3', '3:2', '1:1', '2:3', '3:4', '9:16', '9:21'] },
    { type: 'enable_safety_checker', label: 'Enable Safety Checker', required: false, dataType: 'boolean' },
    { type: 'output_format', label: 'Output Format', required: false, dataType: 'string', options: ['Default', 'jpeg', 'png'] },
    { type: 'safety_tolerance', label: 'Safety Tolerance', required: false, dataType: 'string', options: ['Default', '1', '2', '3', '4', '5'] },
    { type: 'image_url', label: 'Image URL', required: false, dataType: 'string', placeholder: 'Enter image URL (for image-to-image)...' },
  ],
  // Image Models - Flux Pro 1.1
  'flux_pro_1_1': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_size', label: 'Image Size', required: false, dataType: 'string', options: ['Default', 'landscape_4_3', 'landscape_16_9', 'portrait_4_3', 'portrait_16_9', 'square_hd', 'square'] },
    { type: 'enable_safety_checker', label: 'Enable Safety Checker', required: false, dataType: 'boolean' },
    { type: 'output_format', label: 'Output Format', required: false, dataType: 'string', options: ['Default', 'jpeg', 'png'] },
    { type: 'safety_tolerance', label: 'Safety Tolerance', required: false, dataType: 'string', options: ['Default', '1', '2', '3', '4', '5'] },
  ],
  // Image Models - Flux Dev
  'flux_dev': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_size', label: 'Image Size', required: false, dataType: 'string', options: ['Default', 'landscape_4_3', 'landscape_16_9', 'portrait_4_3', 'portrait_16_9', 'square_hd', 'square'] },
    { type: 'num_inference_steps', label: 'Num Inference Steps', required: false, dataType: 'number', placeholder: '28' },
    { type: 'guidance_scale', label: 'Guidance Scale', required: false, dataType: 'number', placeholder: '3.5' },
    { type: 'enable_safety_checker', label: 'Enable Safety Checker', required: false, dataType: 'boolean' },
    { type: 'output_format', label: 'Output Format', required: false, dataType: 'string', options: ['Default', 'jpeg', 'png'] },
    { type: 'acceleration', label: 'Acceleration', required: false, dataType: 'string', options: ['Default', 'none', 'regular'] },
  ],
  // Image Models - Flux LoRA
  'flux_lora': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_size', label: 'Image Size', required: false, dataType: 'string', options: ['Default', 'landscape_4_3', 'landscape_16_9', 'portrait_4_3', 'portrait_16_9', 'square_hd', 'square'] },
    { type: 'num_inference_steps', label: 'Num Inference Steps', required: false, dataType: 'number', placeholder: '28' },
    { type: 'guidance_scale', label: 'Guidance Scale', required: false, dataType: 'number', placeholder: '3.5' },
    { type: 'enable_safety_checker', label: 'Enable Safety Checker', required: false, dataType: 'boolean' },
    { type: 'output_format', label: 'Output Format', required: false, dataType: 'string', options: ['Default', 'jpeg', 'png'] },
    { type: 'loras', label: 'LoRAs', required: false, dataType: 'string', placeholder: 'JSON array: [{"path": "style-name", "scale": 0.8}]' },
  ],
  // Image Models - Ideogram V3
  'ideogram_v3': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_size', label: 'Image Size', required: false, dataType: 'string', options: ['Default', 'square_hd', 'square', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9'] },
    { type: 'rendering_speed', label: 'Rendering Speed', required: false, dataType: 'string', options: ['Default', 'TURBO', 'BALANCED', 'QUALITY'] },
    { type: 'expand_prompt', label: 'Expand Prompt', required: false, dataType: 'boolean' },
    { type: 'image_urls', label: 'Image URLs', required: false, dataType: 'string', placeholder: 'Array of image URLs (max 10MB total, JPEG/PNG/WebP)...' },
    { type: 'color_palette', label: 'Color Palette', required: false, dataType: 'string', placeholder: 'JSON object with preset name OR hex colors with weights...' },
    { type: 'style_codes', label: 'Style Codes', required: false, dataType: 'string', placeholder: 'Array of 8-character hex codes...' },
    { type: 'style', label: 'Style', required: false, dataType: 'string', options: ['Default', 'AUTO', 'GENERAL', 'REALISTIC', 'DESIGN'] },
    { type: 'style_preset', label: 'Style Preset', required: false, dataType: 'string', options: ['Default', '80S_ILLUSTRATION', '90S_NOSTALGIA', 'ABSTRACT_ORGANIC', 'ANALOG_NOSTALGIA', 'ART_BRUT', 'ART_DECO', 'ART_POSTER', 'AURA', 'AVANT_GARDE', 'BAUHAUS', 'BLUEPRINT', 'BLURRY_MOTION', 'BRIGHT_ART', 'C4D_CARTOON', 'CHILDRENS_BOOK', 'COLLAGE', 'COLORING_BOOK_I', 'COLORING_BOOK_II', 'CUBISM', 'DARK_AURA', 'DOODLE', 'DOUBLE_EXPOSURE', 'DRAMATIC_CINEMA', 'EDITORIAL', 'EMOTIONAL_MINIMAL', 'ETHEREAL_PARTY', 'EXPIRED_FILM', 'FLAT_ART', 'FLAT_VECTOR', 'FOREST_REVERIE', 'GEO_MINIMALIST', 'GLASS_PRISM', 'GOLDEN_HOUR', 'GRAFFITI_I', 'GRAFFITI_II', 'HALFTONE_PRINT', 'HIGH_CONTRAST', 'HIPPIE_ERA', 'ICONIC', 'JAPANDI_FUSION', 'JAZZY', 'LONG_EXPOSURE', 'MAGAZINE_EDITORIAL', 'MINIMAL_ILLUSTRATION', 'MIXED_MEDIA', 'MONOCHROME', 'NIGHTLIFE', 'OIL_PAINTING', 'OLD_CARTOONS', 'PAINT_GESTURE', 'POP_ART', 'RETRO_ETCHING', 'RIVIERA_POP', 'SPOTLIGHT_80S', 'STYLIZED_RED', 'SURREAL_COLLAGE', 'TRAVEL_POSTER', 'VINTAGE_GEO', 'VINTAGE_POSTER', 'WATERCOLOR', 'WEIRD', 'WOODBLOCK_PRINT'] },
  ],
  // Image Models - Ideogram V3 Edit
  'ideogram_v3_edit': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'image_url', label: 'Image URL', required: true, dataType: 'string', placeholder: 'Enter image URL (must match mask dimensions exactly)...' },
    { type: 'mask_url', label: 'Mask URL', required: true, dataType: 'string', placeholder: 'Enter mask URL (must match image dimensions exactly, white areas = inpaint)...' },
    { type: 'rendering_speed', label: 'Rendering Speed', required: false, dataType: 'string', options: ['Default', 'TURBO', 'BALANCED', 'QUALITY'] },
    { type: 'expand_prompt', label: 'Expand Prompt', required: false, dataType: 'boolean' },
    { type: 'image_urls', label: 'Image URLs', required: false, dataType: 'string', placeholder: 'Array of image URLs (max 10MB total, JPEG/PNG/WebP)...' },
    { type: 'color_palette', label: 'Color Palette', required: false, dataType: 'string', placeholder: 'JSON object with preset name OR hex colors with weights...' },
    { type: 'style_preset', label: 'Style Preset', required: false, dataType: 'string', options: ['Default', '80S_ILLUSTRATION', '90S_NOSTALGIA', 'ABSTRACT_ORGANIC', 'ANALOG_NOSTALGIA', 'ART_BRUT', 'ART_DECO', 'ART_POSTER', 'AURA', 'AVANT_GARDE', 'BAUHAUS', 'BLUEPRINT', 'BLURRY_MOTION', 'BRIGHT_ART', 'C4D_CARTOON', 'CHILDRENS_BOOK', 'COLLAGE', 'COLORING_BOOK_I', 'COLORING_BOOK_II', 'CUBISM', 'DARK_AURA', 'DOODLE', 'DOUBLE_EXPOSURE', 'DRAMATIC_CINEMA', 'EDITORIAL', 'EMOTIONAL_MINIMAL', 'ETHEREAL_PARTY', 'EXPIRED_FILM', 'FLAT_ART', 'FLAT_VECTOR', 'FOREST_REVERIE', 'GEO_MINIMALIST', 'GLASS_PRISM', 'GOLDEN_HOUR', 'GRAFFITI_I', 'GRAFFITI_II', 'HALFTONE_PRINT', 'HIGH_CONTRAST', 'HIPPIE_ERA', 'ICONIC', 'JAPANDI_FUSION', 'JAZZY', 'LONG_EXPOSURE', 'MAGAZINE_EDITORIAL', 'MINIMAL_ILLUSTRATION', 'MIXED_MEDIA', 'MONOCHROME', 'NIGHTLIFE', 'OIL_PAINTING', 'OLD_CARTOONS', 'PAINT_GESTURE', 'POP_ART', 'RETRO_ETCHING', 'RIVIERA_POP', 'SPOTLIGHT_80S', 'STYLIZED_RED', 'SURREAL_COLLAGE', 'TRAVEL_POSTER', 'VINTAGE_GEO', 'VINTAGE_POSTER', 'WATERCOLOR', 'WEIRD', 'WOODBLOCK_PRINT'] },
  ],
  // Image Models - Imagen 3
  'imagen_3': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '1:1', '16:9', '9:16', '3:4', '4:3'] },
  ],
  // Image Models - Imagen 3 Fast
  'imagen_3_fast': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt...' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '1:1', '16:9', '9:16', '3:4', '4:3'] },
  ],
  // Image Models - Minimax Image
  'minimax_image': [
    { type: 'prompt', label: 'Prompt', required: true, dataType: 'string', placeholder: 'Enter your prompt (max 1500 characters)...' },
    { type: 'aspect_ratio', label: 'Aspect Ratio', required: false, dataType: 'string', options: ['Default', '1:1', '16:9', '4:3', '3:2', '2:3', '3:4', '9:16', '21:9'] },
  ],
};

