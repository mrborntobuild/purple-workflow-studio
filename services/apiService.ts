
import { supabase } from './supabaseClient';

export interface ImageGenerationRequest {
  nodeId: string;
  nodeType: string;
  prompt: string;
  panelSettings?: {
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
    proMode?: boolean;
    autoFix?: boolean;
  };
  inputImages?: string[];
}

export interface StatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId: string;
  result?: {
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
    thumbnailUrl?: string;
    error?: string;
  };
  progress?: number; // 0-100
}

export interface Workflow {
  id?: string;
  title: string;
  nodes: any[]; // CanvasNode[]
  edges: any[]; // Edge[]
  viewState?: {
    x: number;
    y: number;
    zoom: number;
  };
  createdAt?: string;
  updatedAt?: string;
  created_by?: string; // Mapped from database 'created_by'
}

export interface WorkflowListResponse {
  workflows: Workflow[];
  total?: number;
}

export interface WorkflowFilters {
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: 'draft' | 'published' | 'all';
  isStarred?: boolean;
  folderId?: string | null;
  tagIds?: string[];
  sortBy?: 'updated_at' | 'created_at' | 'name' | 'node_count';
  sortOrder?: 'asc' | 'desc';
}

export interface WorkflowResponse {
  workflow: Workflow;
}

// Map node types to backend model strings
const MODEL_MAP: Record<string, string> = {
  // Image Models
  'nano_banana_pro': 'fal-ai/nano-banana-pro',
  'nano_banana_pro_edit': 'fal-ai/nano-banana-pro/edit',
  'flux_pro_1_1_ultra': 'fal-ai/flux-pro/v1.1-ultra',
  'flux_pro_1_1': 'fal-ai/flux-pro/v1.1',
  'flux_dev': 'fal-ai/flux/dev',
  'flux_lora': 'fal-ai/flux-lora',
  'ideogram_v3': 'fal-ai/ideogram/v3',
  'ideogram_v3_edit': 'fal-ai/ideogram/v3/edit',
  'imagen_3': 'fal-ai/imagen3',
  'imagen_3_fast': 'fal-ai/imagen3/fast',
  'minimax_image': 'fal-ai/minimax/image-01',

  // Video Models
  'veo_2': 'fal-ai/veo2',
  'veo_2_i2v': 'fal-ai/veo2/image-to-video',
  'veo_3_1': 'fal-ai/veo3.1',
  'kling_2_6_pro': 'fal-ai/kling-video/v2.6/pro/text-to-video',
  'kling_2_1_pro': 'fal-ai/kling-video/v2.1/pro/image-to-video',
  'kling_2_0_master': 'fal-ai/kling-video/v2/master/text-to-video',
  'kling_1_6_pro': 'fal-ai/kling-video/v1.6/pro/image-to-video',
  'kling_1_6_standard': 'fal-ai/kling-video/v1.6/standard/text-to-video',
  'hunyuan_video_v1_5_i2v': 'fal-ai/hunyuan-video-v1.5/image-to-video',
  'hunyuan_video_v1_5_t2v': 'fal-ai/hunyuan-video',
  'hunyuan_video_i2v': 'fal-ai/hunyuan-video/image-to-video',
  'luma_ray_2': 'fal-ai/luma-dream-machine/ray-2',
  'luma_ray_2_flash': 'fal-ai/luma-dream-machine/ray-2-flash',
  'minimax_hailuo': 'fal-ai/minimax/video-01-live',
  'minimax_director': 'fal-ai/minimax/video-01-director',
  'pika_2_2': 'fal-ai/pika/v2.2',
  'ltx_video': 'fal-ai/ltx-video',
  'wan_i2v': 'fal-ai/wan/v2.1/image-to-video',
};

// Transform panel settings to API format (snake_case) with model-specific logic
function transformPanelSettings(settings: any, nodeType: string): Record<string, any> {
  const apiSettings: Record<string, any> = {};
  
  if (!settings) {
    // Still set num_images even if no settings
    apiSettings.num_images = 1;
    return apiSettings;
  }
  
  // Always set num_images to 1 (not shown in UI)
  apiSettings.num_images = 1;
  
  // Common field mappings (camelCase to snake_case)
  if (settings.aspectRatio && settings.aspectRatio !== 'Default') {
    apiSettings.aspect_ratio = settings.aspectRatio;
  }
  if (settings.outputFormat && settings.outputFormat !== 'Default') {
    apiSettings.output_format = settings.outputFormat;
  }
  if (settings.resolution && settings.resolution !== 'Default') {
    apiSettings.resolution = settings.resolution;
  }
  if (settings.imageSize && settings.imageSize !== 'Default' && settings.imageSize !== 'Match Input Image') {
    apiSettings.image_size = settings.imageSize;
  }
  if (settings.negativePrompt) {
    apiSettings.negative_prompt = settings.negativePrompt;
  }
  if (settings.seed && !settings.seedRandom) {
    apiSettings.seed = settings.seed;
  }
  if (settings.imageUrl) {
    apiSettings.image_url = settings.imageUrl;
  }
  if (settings.maskUrl) {
    apiSettings.mask_url = settings.maskUrl;
  }
  if (settings.imageUrls) {
    // Handle both string (JSON) and array formats
    if (typeof settings.imageUrls === 'string') {
      try {
        apiSettings.image_urls = JSON.parse(settings.imageUrls);
      } catch {
        // If not valid JSON, treat as single URL string wrapped in array
        apiSettings.image_urls = [settings.imageUrls];
      }
    } else if (Array.isArray(settings.imageUrls)) {
      apiSettings.image_urls = settings.imageUrls;
    }
  }
  
  // Model-specific parameter mappings
  if (settings.enableSafetyChecker !== undefined) {
    apiSettings.enable_safety_checker = settings.enableSafetyChecker;
  }
  
  if (settings.safetyTolerance && settings.safetyTolerance !== 'Default') {
    apiSettings.safety_tolerance = settings.safetyTolerance;
  }
  
  if (settings.numInferenceSteps !== undefined && settings.numInferenceSteps !== '' && settings.numInferenceSteps !== null) {
    const numSteps = typeof settings.numInferenceSteps === 'string' ? parseInt(settings.numInferenceSteps) : settings.numInferenceSteps;
    if (!isNaN(numSteps) && numSteps > 0) {
      apiSettings.num_inference_steps = numSteps;
    }
  }
  
  if (settings.guidanceScale !== undefined && settings.guidanceScale !== '' && settings.guidanceScale !== null) {
    const guidance = typeof settings.guidanceScale === 'string' ? parseFloat(settings.guidanceScale) : settings.guidanceScale;
    if (!isNaN(guidance) && guidance > 0) {
      apiSettings.guidance_scale = guidance;
    }
  }
  
  if (settings.acceleration && settings.acceleration !== 'Default') {
    apiSettings.acceleration = settings.acceleration;
  }
  
  if (settings.renderingSpeed && settings.renderingSpeed !== 'Default') {
    apiSettings.rendering_speed = settings.renderingSpeed;
  }
  
  if (settings.expandPrompt !== undefined) {
    apiSettings.expand_prompt = settings.expandPrompt;
  }
  
  if (settings.loras) {
    // Handle both string (JSON) and array formats
    if (typeof settings.loras === 'string') {
      try {
        apiSettings.loras = JSON.parse(settings.loras);
      } catch {
        // If not valid JSON, skip
      }
    } else if (Array.isArray(settings.loras)) {
      apiSettings.loras = settings.loras;
    }
  }
  
  // Map sync_mode, limit_generations, enable_web_search
  if (settings.syncMode !== undefined) {
    apiSettings.sync_mode = settings.syncMode;
  }
  if (settings.limitGenerations !== undefined) {
    apiSettings.limit_generations = settings.limitGenerations;
  }
  if (settings.enableWebSearch !== undefined) {
    apiSettings.enable_web_search = settings.enableWebSearch;
  }

  // Video-specific parameters
  if (settings.duration && settings.duration !== 'Default') {
    apiSettings.duration = settings.duration;
  }
  if (settings.generateAudio !== undefined) {
    apiSettings.generate_audio = settings.generateAudio;
  }
  if (settings.cfgScale !== undefined && settings.cfgScale !== '' && settings.cfgScale !== null) {
    const cfg = typeof settings.cfgScale === 'string' ? parseFloat(settings.cfgScale) : settings.cfgScale;
    if (!isNaN(cfg)) {
      apiSettings.cfg_scale = cfg;
    }
  }
  if (settings.loop !== undefined) {
    apiSettings.loop = settings.loop;
  }
  if (settings.promptOptimizer !== undefined) {
    apiSettings.prompt_optimizer = settings.promptOptimizer;
  }
  if (settings.enhancePrompt !== undefined) {
    apiSettings.enhance_prompt = settings.enhancePrompt;
  }
  if (settings.numFrames !== undefined && settings.numFrames !== '' && settings.numFrames !== null) {
    const frames = typeof settings.numFrames === 'string' ? parseInt(settings.numFrames) : settings.numFrames;
    if (!isNaN(frames) && frames > 0) {
      apiSettings.num_frames = frames;
    }
  }
  if (settings.proMode !== undefined) {
    apiSettings.pro_mode = settings.proMode;
  }
  if (settings.enablePromptExpansion !== undefined) {
    apiSettings.enable_prompt_expansion = settings.enablePromptExpansion;
  }
  if (settings.autoFix !== undefined) {
    apiSettings.auto_fix = settings.autoFix;
  }

  // Model-specific defaults and requirements based on API documentation
  switch (nodeType) {
    case 'nano_banana_pro':
      // Default: output_format: "png", resolution: "1K", aspect_ratio: "1:1"
      if (!apiSettings.output_format) apiSettings.output_format = 'png';
      if (!apiSettings.resolution) apiSettings.resolution = '1K';
      if (!apiSettings.aspect_ratio) apiSettings.aspect_ratio = '1:1';
      // Always set these for edit model
      if (apiSettings.sync_mode === undefined) apiSettings.sync_mode = false;
      if (apiSettings.limit_generations === undefined) apiSettings.limit_generations = false;
      if (apiSettings.enable_web_search === undefined) apiSettings.enable_web_search = false;
      break;
    case 'nano_banana_pro_edit':
      // Default: output_format: "png", resolution: "1K", aspect_ratio: "1:1"
      if (!apiSettings.output_format) apiSettings.output_format = 'png';
      if (!apiSettings.resolution) apiSettings.resolution = '1K';
      if (!apiSettings.aspect_ratio) apiSettings.aspect_ratio = '1:1';
      // Always set these for edit model
      if (apiSettings.sync_mode === undefined) apiSettings.sync_mode = false;
      if (apiSettings.limit_generations === undefined) apiSettings.limit_generations = false;
      if (apiSettings.enable_web_search === undefined) apiSettings.enable_web_search = false;
      break;
      
    case 'flux_pro_1_1_ultra':
      // Default: enable_safety_checker: true, safety_tolerance: "2", output_format: "jpeg"
      if (apiSettings.enable_safety_checker === undefined) apiSettings.enable_safety_checker = true;
      if (!apiSettings.safety_tolerance) apiSettings.safety_tolerance = '2';
      if (!apiSettings.output_format) apiSettings.output_format = 'jpeg';
      break;
      
    case 'flux_pro_1_1':
      // Default: enable_safety_checker: true, safety_tolerance: "2", output_format: "jpeg"
      if (apiSettings.enable_safety_checker === undefined) apiSettings.enable_safety_checker = true;
      if (!apiSettings.safety_tolerance) apiSettings.safety_tolerance = '2';
      if (!apiSettings.output_format) apiSettings.output_format = 'jpeg';
      break;
      
    case 'flux_dev':
      // Default: num_inference_steps: 28, guidance_scale: 3.5, enable_safety_checker: true, output_format: "jpeg", acceleration: "none"
      if (!apiSettings.num_inference_steps) apiSettings.num_inference_steps = 28;
      if (!apiSettings.guidance_scale) apiSettings.guidance_scale = 3.5;
      if (apiSettings.enable_safety_checker === undefined) apiSettings.enable_safety_checker = true;
      if (!apiSettings.output_format) apiSettings.output_format = 'jpeg';
      if (!apiSettings.acceleration) apiSettings.acceleration = 'none';
      break;
      
    case 'flux_lora':
      // Default: num_inference_steps: 28, guidance_scale: 3.5, enable_safety_checker: true, output_format: "jpeg"
      if (!apiSettings.num_inference_steps) apiSettings.num_inference_steps = 28;
      if (!apiSettings.guidance_scale) apiSettings.guidance_scale = 3.5;
      if (apiSettings.enable_safety_checker === undefined) apiSettings.enable_safety_checker = true;
      if (!apiSettings.output_format) apiSettings.output_format = 'jpeg';
      break;
      
    case 'ideogram_v3':
      // Default: rendering_speed: "BALANCED", expand_prompt: true
      if (!apiSettings.rendering_speed) apiSettings.rendering_speed = 'BALANCED';
      if (apiSettings.expand_prompt === undefined) apiSettings.expand_prompt = true;
      break;
      
    case 'ideogram_v3_edit':
      // Default: rendering_speed: "BALANCED", expand_prompt: true
      if (!apiSettings.rendering_speed) apiSettings.rendering_speed = 'BALANCED';
      if (apiSettings.expand_prompt === undefined) apiSettings.expand_prompt = true;
      break;
      
    case 'imagen_3':
    case 'imagen_3_fast':
    case 'minimax_image':
      // No additional defaults needed
      break;

    // Video Models
    case 'veo_2':
    case 'veo_2_i2v':
      // Default: aspect_ratio: "16:9", duration: "5s", enhance_prompt: true
      if (!apiSettings.aspect_ratio) apiSettings.aspect_ratio = '16:9';
      if (!apiSettings.duration) apiSettings.duration = '5s';
      if (apiSettings.enhance_prompt === undefined) apiSettings.enhance_prompt = true;
      break;

    case 'veo_3_1':
      // Default: aspect_ratio: "16:9", duration: "8s", resolution: "720p", generate_audio: true
      if (!apiSettings.aspect_ratio) apiSettings.aspect_ratio = '16:9';
      if (!apiSettings.duration) apiSettings.duration = '8s';
      if (!apiSettings.resolution) apiSettings.resolution = '720p';
      if (apiSettings.generate_audio === undefined) apiSettings.generate_audio = true;
      break;

    case 'kling_2_6_pro':
      // Default: duration: "5", aspect_ratio: "16:9", cfg_scale: 0.5, generate_audio: true
      if (!apiSettings.duration) apiSettings.duration = '5';
      if (!apiSettings.aspect_ratio) apiSettings.aspect_ratio = '16:9';
      if (apiSettings.cfg_scale === undefined) apiSettings.cfg_scale = 0.5;
      if (apiSettings.generate_audio === undefined) apiSettings.generate_audio = true;
      break;

    case 'kling_2_1_pro':
    case 'kling_2_0_master':
    case 'kling_1_6_pro':
    case 'kling_1_6_standard':
      // Default: duration: "5", aspect_ratio: "16:9", cfg_scale: 0.5
      if (!apiSettings.duration) apiSettings.duration = '5';
      if (!apiSettings.aspect_ratio) apiSettings.aspect_ratio = '16:9';
      if (apiSettings.cfg_scale === undefined) apiSettings.cfg_scale = 0.5;
      break;

    case 'hunyuan_video_v1_5_t2v':
      // Default: num_inference_steps: 30, aspect_ratio: "16:9", resolution: "720p"
      if (!apiSettings.num_inference_steps) apiSettings.num_inference_steps = 30;
      if (!apiSettings.aspect_ratio) apiSettings.aspect_ratio = '16:9';
      if (!apiSettings.resolution) apiSettings.resolution = '720p';
      break;

    case 'hunyuan_video_v1_5_i2v':
    case 'hunyuan_video_i2v':
      // Default: num_inference_steps: 28, aspect_ratio: "16:9", resolution: "480p", enable_prompt_expansion: true
      if (!apiSettings.num_inference_steps) apiSettings.num_inference_steps = 28;
      if (!apiSettings.aspect_ratio) apiSettings.aspect_ratio = '16:9';
      if (!apiSettings.resolution) apiSettings.resolution = '480p';
      if (apiSettings.enable_prompt_expansion === undefined) apiSettings.enable_prompt_expansion = true;
      break;

    case 'luma_ray_2':
    case 'luma_ray_2_flash':
      // Default: aspect_ratio: "16:9", resolution: "540p", duration: "5s"
      if (!apiSettings.aspect_ratio) apiSettings.aspect_ratio = '16:9';
      if (!apiSettings.resolution) apiSettings.resolution = '540p';
      if (!apiSettings.duration) apiSettings.duration = '5s';
      break;

    case 'minimax_hailuo':
    case 'minimax_director':
      // Default: prompt_optimizer: true
      if (apiSettings.prompt_optimizer === undefined) apiSettings.prompt_optimizer = true;
      break;

    case 'ltx_video':
      // Default: num_inference_steps: 30, guidance_scale: 3
      if (!apiSettings.num_inference_steps) apiSettings.num_inference_steps = 30;
      if (!apiSettings.guidance_scale) apiSettings.guidance_scale = 3;
      break;

    case 'pika_2_2':
    case 'wan_i2v':
      // No additional defaults needed
      break;
  }

  return apiSettings;
}

// Map backend status to our status format
function mapBackendStatus(backendStatus: string): 'pending' | 'processing' | 'completed' | 'failed' {
  const statusMap: Record<string, 'pending' | 'processing' | 'completed' | 'failed'> = {
    'IN_QUEUE': 'pending',
    'IN_PROGRESS': 'processing',
    'PROCESSING': 'processing',
    'COMPLETED': 'completed',
    'FAILED': 'failed',
    'pending': 'pending',
    'processing': 'processing',
    'completed': 'completed',
    'failed': 'failed'
  };
  
  return statusMap[backendStatus?.toUpperCase()] || 'pending';
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Always use /api for local Vercel serverless functions (same domain, no CORS)
    this.baseUrl = baseUrl || '/api';
    console.log('🔧 [ApiService] Initialized with baseUrl:', this.baseUrl);
    console.log('🔧 [ApiService] Development mode:', import.meta.env.DEV);
  }

  // Initiate image generation
  async startImageGeneration(request: ImageGenerationRequest): Promise<{ jobId: string; usedModel?: string }> {
    console.log('[ApiService] startImageGeneration', request);

    // Transform settings to API format (num_images: 1 is always set here)
    const apiSettings = transformPanelSettings(request.panelSettings, request.nodeType);

    // Build the API request body
    const apiRequestBody: Record<string, any> = {
      nodeType: request.nodeType,
      prompt: request.prompt || '',
      ...apiSettings
    };

    // Handle input images
    if (request.inputImages && request.inputImages.length > 0) {
      // nano_banana_pro_edit always needs image_urls as array
      if (request.nodeType === 'nano_banana_pro_edit' || request.nodeType === 'nano_banana_pro') {
        apiRequestBody.image_urls = request.inputImages;
      } else if (request.inputImages.length === 1) {
        apiRequestBody.image_url = request.inputImages[0];
      } else {
        apiRequestBody.image_urls = request.inputImages;
      }
    }

    // Special handling for models that require images
    const imageRequiredModels = [
      'nano_banana_pro_edit',
      'veo_2_i2v',
      'kling_2_1_pro',
      'kling_1_6_pro',
      'hunyuan_video_v1_5_i2v',
      'hunyuan_video_i2v',
      'wan_i2v',
      'pika_2_2'
    ];
    if (imageRequiredModels.includes(request.nodeType) && (!request.inputImages || request.inputImages.length === 0)) {
      throw new Error(`${request.nodeType} requires at least one input image`);
    }

    // For nano_banana_pro with images, use the edit variant
    if (request.nodeType === 'nano_banana_pro' && request.inputImages && request.inputImages.length > 0) {
      apiRequestBody.nodeType = 'nano_banana_pro_edit';
    }

    console.log('[ApiService] Calling /api/fal/generate with:', apiRequestBody);

    const response = await fetch(`${this.baseUrl}/fal/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiRequestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start generation: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('[ApiService] Generate response:', result);

    // Handle response from our Vercel API
    if (result.request_id) {
      return { jobId: result.request_id, usedModel: result.model };
    }

    throw new Error(result.error || 'Invalid response format from API');
  }

  // Check status of a job
  async getJobStatus(jobId: string, nodeType: string, usedModel?: string): Promise<StatusResponse> {
    const model = usedModel || MODEL_MAP[nodeType];
    if (!model) {
      throw new Error(`Unknown model type: ${nodeType}`);
    }

    console.log('[ApiService] Checking status:', { jobId, nodeType, model });

    const response = await fetch(`${this.baseUrl}/fal/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request_id: jobId,
        model: model
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get status: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('[ApiService] Status response:', result);

    // Map FAL status to our internal status
    const statusMap: Record<string, 'pending' | 'processing' | 'completed' | 'failed'> = {
      'PENDING': 'pending',
      'IN_QUEUE': 'pending',
      'IN_PROGRESS': 'processing',
      'COMPLETED': 'completed',
      'FAILED': 'failed',
    };

    const mappedStatus = statusMap[result.status] || 'processing';

    // Extract output URL based on result type
    let imageUrl: string | undefined;
    let videoUrl: string | undefined;
    let audioUrl: string | undefined;
    let thumbnailUrl: string | undefined;

    if (mappedStatus === 'completed' && result.output_url) {
      // Determine type based on URL or model
      const url = result.output_url;
      if (url.match(/\.(mp4|webm|mov)($|\?)/i)) {
        videoUrl = url;
      } else if (url.match(/\.(mp3|wav|ogg)($|\?)/i)) {
        audioUrl = url;
      } else {
        imageUrl = url;
      }
    }

    // Extract thumbnail URL
    if (mappedStatus === 'completed') {
      if (result.thumbnail_url) {
        thumbnailUrl = result.thumbnail_url;
      } else if (result.raw?.video?.thumbnail_url) {
        thumbnailUrl = result.raw.video.thumbnail_url;
      } else if (result.raw?.thumbnail?.url) {
        thumbnailUrl = result.raw.thumbnail.url;
      }
    }

    // Also check raw result for nested data
    if (mappedStatus === 'completed' && result.raw) {
      const raw = result.raw;
      if (!imageUrl && raw.images?.[0]?.url) {
        imageUrl = raw.images[0].url;
      }
      if (!videoUrl && raw.video?.url) {
        videoUrl = raw.video.url;
      }
      if (!audioUrl && raw.audio?.url) {
        audioUrl = raw.audio.url;
      }
    }

    return {
      status: mappedStatus,
      jobId,
      result: imageUrl || videoUrl || audioUrl ? {
        imageUrl,
        videoUrl,
        audioUrl,
        thumbnailUrl
      } : undefined,
      progress: result.progress || 0
    };
  }

  // Legacy method - keeping for compatibility but now unused
  async _getJobStatusLegacy(jobId: string, nodeType: string, usedModel?: string): Promise<StatusResponse> {
    const model = usedModel || MODEL_MAP[nodeType];
    if (!model) {
      throw new Error(`Unknown model type: ${nodeType}`);
    }

    const url = `${this.baseUrl}/fal/tasks/${jobId}?model=${encodeURIComponent(model)}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get status: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error('Invalid response format from status API');
    }

    const backendStatus = result.data.status;
    const mappedStatus = mapBackendStatus(backendStatus);

    let imageUrl: string | undefined;

    if (mappedStatus === 'completed') {
      if (result.data.result) {
        if (result.data.result.images && Array.isArray(result.data.result.images) && result.data.result.images.length > 0) {
          imageUrl = result.data.result.images[0].url;
        } else if (result.data.result.image?.url) {
          imageUrl = result.data.result.image.url;
        } else if (result.data.result.url) {
          imageUrl = result.data.result.url;
        } else if (result.data.result.data) {
          if (result.data.result.data.images && Array.isArray(result.data.result.data.images) && result.data.result.data.images.length > 0) {
            imageUrl = result.data.result.data.images[0].url;
          } else if (result.data.result.data.image?.url) {
            imageUrl = result.data.result.data.image.url;
          } else if (result.data.result.data.url) {
            imageUrl = result.data.result.data.url;
          }
        }
      }
    }

    const statusResponse = {
      status: mappedStatus,
      jobId,
      result: imageUrl ? { imageUrl } : undefined,
      progress: result.data.progress || result.progress
    };

    return statusResponse;
  }

  // Save a workflow (Create or Update)
  async saveWorkflow(workflow: Workflow): Promise<WorkflowResponse> {
    console.log('🔵 [apiService.saveWorkflow] Starting save...');
    console.log('🔵 [apiService.saveWorkflow] Input workflow:', {
      id: workflow.id,
      title: workflow.title,
      nodesCount: workflow.nodes?.length,
      edgesCount: workflow.edges?.length,
      hasViewState: !!workflow.viewState
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('🔴 [apiService.saveWorkflow] Auth error:', authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }

    if (!user) {
      console.error('🔴 [apiService.saveWorkflow] No user logged in');
      throw new Error('User must be logged in to save workflows');
    }

    console.log('🔵 [apiService.saveWorkflow] User authenticated:', user.id);

    // Prepare payload
    // Map internal 'title' to database 'name'
    const payload: any = {
      name: workflow.title,
      nodes: workflow.nodes,
      edges: workflow.edges,
      view_state: workflow.viewState,
      created_by: user.id,
      updated_at: new Date().toISOString()
    };

    console.log('🔵 [apiService.saveWorkflow] Payload prepared:', {
      name: payload.name,
      nodesCount: payload.nodes?.length,
      edgesCount: payload.edges?.length,
      created_by: payload.created_by,
      updated_at: payload.updated_at
    });

    if (workflow.id) {
      // Update existing - don't update created_by on existing workflows
      const updatePayload = {
        name: payload.name,
        nodes: payload.nodes,
        edges: payload.edges,
        view_state: payload.view_state,
        updated_at: payload.updated_at
      };
      console.log('🔵 [apiService.saveWorkflow] Updating existing workflow:', workflow.id);
      console.log('🔵 [apiService.saveWorkflow] Update payload (without created_by):', updatePayload);

      // First, try to update with user ownership check
      let { data, error } = await supabase
        .from('workflows')
        .update(updatePayload)
        .eq('id', workflow.id)
        .eq('created_by', user.id)
        .select()
        .single();

      // If no match found, try updating without created_by check (legacy workflows with null created_by)
      if (error && error.code === 'PGRST116') {
        console.log('🔵 [apiService.saveWorkflow] No match with user check, trying legacy update...');
        // Also claim ownership of legacy workflows
        const legacyUpdatePayload = { ...updatePayload, created_by: user.id };
        const legacyResult = await supabase
          .from('workflows')
          .update(legacyUpdatePayload)
          .eq('id', workflow.id)
          .is('created_by', null) // Only update if created_by is null
          .select()
          .single();

        data = legacyResult.data;
        error = legacyResult.error;

        if (!error) {
          console.log('🟢 [apiService.saveWorkflow] Legacy workflow claimed and updated');
        }
      }

      if (error) {
        console.error('🔴 [apiService.saveWorkflow] Supabase UPDATE error:', error);
        console.error('🔴 [apiService.saveWorkflow] Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      if (!data) {
        console.error('🔴 [apiService.saveWorkflow] UPDATE returned no data - workflow may not exist or user lacks permission');
        throw new Error('Workflow not found or you do not have permission to update it');
      }

      console.log('🟢 [apiService.saveWorkflow] UPDATE successful, returned data:', {
        id: data.id,
        name: data.name,
        nodesCount: data.nodes?.length,
        edgesCount: data.edges?.length
      });

      // Verify the update by re-fetching
      console.log('🔵 [apiService.saveWorkflow] Verifying UPDATE by re-fetching...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', data.id)
        .single();

      if (verifyError || !verifyData) {
        console.error('🔴 [apiService.saveWorkflow] VERIFICATION FAILED - workflow not found after UPDATE!', verifyError);
        throw new Error('Workflow update verification failed');
      }
      console.log('🟢 [apiService.saveWorkflow] Verification successful - workflow confirmed in DB:', {
        id: verifyData.id,
        name: verifyData.name,
        nodesCount: verifyData.nodes?.length,
        edgesCount: verifyData.edges?.length,
        updated_at: verifyData.updated_at
      });

      return {
        workflow: {
          id: data.id,
          title: data.name || data.title || 'Untitled Workflow',
          nodes: data.nodes,
          edges: data.edges,
          viewState: data.view_state,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          created_by: data.created_by
        }
      };
    } else {
      // Create new - first check if a workflow with this name already exists for this user
      console.log('🔵 [apiService.saveWorkflow] Creating new workflow');

      // Check for existing workflow with same name by this user
      const { data: existingWorkflow } = await supabase
        .from('workflows')
        .select('id')
        .eq('name', payload.name)
        .eq('created_by', user.id)
        .single();

      if (existingWorkflow) {
        // Workflow with this name already exists - update it instead
        console.log('🔵 [apiService.saveWorkflow] Found existing workflow with same name, updating instead:', existingWorkflow.id);
        const { data, error } = await supabase
          .from('workflows')
          .update({
            nodes: payload.nodes,
            edges: payload.edges,
            view_state: payload.view_state,
            updated_at: payload.updated_at
          })
          .eq('id', existingWorkflow.id)
          .select()
          .single();

        if (error) {
          console.error('🔴 [apiService.saveWorkflow] Supabase UPDATE (existing name) error:', error);
          throw error;
        }

        return {
          workflow: {
            id: data.id,
            title: data.name || data.title || 'Untitled Workflow',
            nodes: data.nodes,
            edges: data.edges,
            viewState: data.view_state,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            created_by: data.created_by
          }
        };
      }

      const { data, error } = await supabase
        .from('workflows')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('🔴 [apiService.saveWorkflow] Supabase INSERT error:', error);
        console.error('🔴 [apiService.saveWorkflow] Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('🟢 [apiService.saveWorkflow] INSERT successful, returned data:', {
        id: data.id,
        name: data.name,
        nodesCount: data.nodes?.length,
        edgesCount: data.edges?.length
      });

      // Verify the save by re-fetching
      console.log('🔵 [apiService.saveWorkflow] Verifying INSERT by re-fetching...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', data.id)
        .single();

      if (verifyError || !verifyData) {
        console.error('🔴 [apiService.saveWorkflow] VERIFICATION FAILED - workflow not found after INSERT!', verifyError);
        throw new Error('Workflow was not saved to database - verification failed');
      }
      console.log('🟢 [apiService.saveWorkflow] Verification successful - workflow confirmed in DB:', {
        id: verifyData.id,
        name: verifyData.name,
        nodesCount: verifyData.nodes?.length,
        edgesCount: verifyData.edges?.length
      });

      return {
        workflow: {
          id: data.id,
          title: data.name || data.title || 'Untitled Workflow',
          nodes: data.nodes,
          edges: data.edges,
          viewState: data.view_state,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          created_by: data.created_by
        }
      };
    }
  }

  // Get a workflow by ID
  async getWorkflow(id: string): Promise<WorkflowResponse> {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      workflow: {
        id: data.id,
        title: data.name || data.title || 'Untitled Workflow',
        nodes: data.nodes,
        edges: data.edges,
        viewState: data.view_state,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        created_by: data.created_by
      }
    };
  }

  // List all workflows
  async listWorkflows(): Promise<WorkflowListResponse> {
    console.log('🔄 [ApiService] listWorkflows called');
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn('⚠️ [ApiService] No user logged in, returning empty list');
      return { workflows: [], total: 0 };
    }
    console.log('👤 [ApiService] Current user ID:', user.id);

    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ [ApiService] Error fetching workflows:', error);
      throw error;
    }

    console.log('✅ [ApiService] Raw data from Supabase:', data?.length, 'rows');
    if (data && data.length > 0) {
      console.log('📄 [ApiService] First row sample:', data[0]);
    }

    const workflows = data.map((w: any) => ({
      id: w.id,
      title: w.name || w.title || 'Untitled Workflow',
      nodes: w.nodes,
      edges: w.edges,
      viewState: w.view_state,
      createdAt: w.created_at,
      updatedAt: w.updated_at,
      created_by: w.created_by
    }));

    return { workflows, total: workflows.length };
  }

  // List workflows with filtering and sorting
  async listWorkflowsFiltered(filters: WorkflowFilters = {}): Promise<WorkflowListResponse> {
    console.log('🔄 [ApiService] listWorkflowsFiltered called with:', filters);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn('⚠️ [ApiService] No user logged in, returning empty list');
      return { workflows: [], total: 0 };
    }

    // Start building the query
    let query = supabase.from('workflows').select('*');

    // Apply search filter (searches in name/title)
    if (filters.search && filters.search.trim()) {
      query = query.ilike('name', `%${filters.search.trim()}%`);
    }

    // Apply date range filters
    if (filters.dateFrom) {
      query = query.gte('updated_at', filters.dateFrom.toISOString());
    }
    if (filters.dateTo) {
      // Add 1 day to include the entire "to" date
      const toDate = new Date(filters.dateTo);
      toDate.setDate(toDate.getDate() + 1);
      query = query.lt('updated_at', toDate.toISOString());
    }

    // Apply status filter (if status column exists)
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    // Apply starred filter (if is_starred column exists)
    if (filters.isStarred !== undefined) {
      query = query.eq('is_starred', filters.isStarred);
    }

    // Apply folder filter (if folder_id column exists)
    if (filters.folderId !== undefined) {
      if (filters.folderId === null) {
        query = query.is('folder_id', null);
      } else {
        query = query.eq('folder_id', filters.folderId);
      }
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'updated_at';
    const sortOrder = filters.sortOrder || 'desc';

    // Handle node_count sorting specially (need to sort in memory)
    if (sortBy === 'node_count') {
      query = query.order('updated_at', { ascending: false }); // Default sort for fetch
    } else {
      const sortColumn = sortBy === 'name' ? 'name' : sortBy;
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ [ApiService] Error fetching filtered workflows:', error);
      throw error;
    }

    console.log('✅ [ApiService] Filtered data from Supabase:', data?.length, 'rows');

    let workflows = data.map((w: any) => ({
      id: w.id,
      title: w.name || w.title || 'Untitled Workflow',
      nodes: w.nodes,
      edges: w.edges,
      viewState: w.view_state,
      createdAt: w.created_at,
      updatedAt: w.updated_at,
      created_by: w.created_by,
      status: w.status,
      is_starred: w.is_starred,
      folder_id: w.folder_id,
      description: w.description
    }));

    // Handle node_count sorting in memory (since it's computed)
    if (sortBy === 'node_count') {
      workflows.sort((a, b) => {
        const countA = a.nodes?.length || 0;
        const countB = b.nodes?.length || 0;
        return sortOrder === 'asc' ? countA - countB : countB - countA;
      });
    }

    return { workflows, total: workflows.length };
  }

  // Delete a workflow
  async deleteWorkflow(id: string): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Start a workflow execution
  async startWorkflowRun(workflowId: string, inputData?: Record<string, any>): Promise<{
    runId: string;
    status: string;
    totalNodes: number;
  }> {
    console.log('🔵 [apiService.startWorkflowRun] Starting workflow:', workflowId);

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User must be logged in to run workflows');
    }

    const response = await fetch(`${this.baseUrl}/workflow/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workflowId,
        userId: user.id,
        inputData: inputData || {}
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start workflow: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('🟢 [apiService.startWorkflowRun] Run started:', result);

    return {
      runId: result.runId,
      status: result.status,
      totalNodes: result.totalNodes
    };
  }

  // Get workflow run status
  async getWorkflowRunStatus(runId: string): Promise<{
    runId: string;
    status: string;
    totalNodes: number;
    completedNodes: number;
    output?: Record<string, any>;
    error?: string;
    logs?: Array<{
      nodeId: string;
      nodeType: string;
      status: string;
      output?: any;
      error?: string;
      order: number;
    }>;
  }> {
    console.log('🔵 [apiService.getWorkflowRunStatus] Checking status:', runId);

    const response = await fetch(`${this.baseUrl}/workflow/run/${runId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get run status: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return result;
  }

  // Get execution logs for a run
  async getExecutionLogs(runId: string): Promise<{
    runId: string;
    workflowId: string;
    runStatus: string;
    totalNodes: number;
    completedNodes: number;
    logs: Array<{
      id: string;
      nodeId: string;
      nodeType: string;
      nodeLabel: string;
      status: string;
      input?: any;
      output?: any;
      jobId?: string;
      error?: string;
      executionOrder: number;
      startedAt?: string;
      completedAt?: string;
      duration?: number;
    }>;
  }> {
    console.log('🔵 [apiService.getExecutionLogs] Fetching logs:', runId);

    const response = await fetch(`${this.baseUrl}/workflow/run/${runId}/logs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get logs: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return result;
  }

  // List workflow runs for a workflow
  async listWorkflowRuns(workflowId: string): Promise<Array<{
    id: string;
    status: string;
    totalNodes: number;
    completedNodes: number;
    startedAt?: string;
    completedAt?: string;
    createdAt: string;
  }>> {
    console.log('🔵 [apiService.listWorkflowRuns] Listing runs for:', workflowId);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('workflow_runs')
      .select('*')
      .eq('workflow_id', workflowId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('🔴 [apiService.listWorkflowRuns] Error:', error);
      throw error;
    }

    return (data || []).map(run => ({
      id: run.id,
      status: run.status,
      totalNodes: run.total_nodes,
      completedNodes: run.completed_nodes,
      startedAt: run.started_at,
      completedAt: run.completed_at,
      createdAt: run.created_at
    }));
  }
}

export const apiService = new ApiService();
