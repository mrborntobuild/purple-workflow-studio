
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
  };
  inputImages?: string[];
}

export interface StatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId: string;
  result?: {
    imageUrl?: string;
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

export interface WorkflowResponse {
  workflow: Workflow;
}

// Map node types to backend model strings
const MODEL_MAP: Record<string, string> = {
  'nano_banana_pro': 'fal-ai/nano-banana-pro/edit',
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
    // In development, use the proxy path to avoid CORS preflight
    const devBaseUrl = import.meta.env.DEV 
      ? '/api/webhook'  // Use proxy in development (same-origin, no CORS)
      : (import.meta.env.VITE_API_BASE_URL || 'https://buildhouse.app.n8n.cloud/webhook');
    
    this.baseUrl = baseUrl || devBaseUrl;
    console.log('🔧 [ApiService] Initialized with baseUrl:', this.baseUrl);
    console.log('🔧 [ApiService] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    console.log('🔧 [ApiService] Development mode:', import.meta.env.DEV);
  }

  // Initiate image generation
  async startImageGeneration(request: ImageGenerationRequest): Promise<{ jobId: string; usedModel?: string }> {
    console.log('[ApiService] startImageGeneration', request);
    const model = MODEL_MAP[request.nodeType];
    if (!model) {
      throw new Error(`Unknown model type: ${request.nodeType}`);
    }

    // Transform settings to API format (num_images: 1 is always set here)
    const apiSettings = transformPanelSettings(request.panelSettings, request.nodeType);

    // Build the API request body - ALWAYS include prompt
    const apiRequestBody: Record<string, any> = {
      model,
      waitForCompletion: false,
      prompt: request.prompt || '', // Always include prompt, even if empty
      ...apiSettings
    };

    // Handle input images
    if (request.nodeType === 'nano_banana_pro') {
      const hasConnectedImages = request.inputImages && request.inputImages.length > 0;
      
      if (hasConnectedImages) {
        apiRequestBody.model = 'fal-ai/nano-banana-pro/edit';
        apiRequestBody.image_urls = request.inputImages || [];
      } else {
        apiRequestBody.model = 'fal-ai/nano-banana-pro';
      }

      // Call n8n webhook for nano_banana_pro
      const response = await fetch('https://buildhouse.app.n8n.cloud/webhook/call-image-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiRequestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start generation: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      
      if (result.request_id) {
        return { jobId: result.request_id, usedModel: apiRequestBody.model };
      } else if (result.jobId) {
        return { jobId: result.jobId, usedModel: apiRequestBody.model };
      } else if (result.success && result.data?.request_id) {
        return { jobId: result.data.request_id, usedModel: apiRequestBody.model };
      }
      
      throw new Error('No request_id returned from n8n webhook');
    } else if (request.nodeType === 'nano_banana_pro_edit') {
      if (!request.inputImages || request.inputImages.length === 0) {
        throw new Error('Nano Banana Pro Edit requires at least one input image');
      }
      
      apiRequestBody.model = 'fal-ai/nano-banana-pro/edit';
      apiRequestBody.image_urls = request.inputImages;

      const response = await fetch('https://buildhouse.app.n8n.cloud/webhook/call-image-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiRequestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start generation: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      
      if (result.request_id) {
        return { jobId: result.request_id, usedModel: apiRequestBody.model };
      } else if (result.jobId) {
        return { jobId: result.jobId, usedModel: apiRequestBody.model };
      } else if (result.success && result.data?.request_id) {
        return { jobId: result.data.request_id, usedModel: apiRequestBody.model };
      }
      
      throw new Error('No request_id returned from n8n webhook');
    } else if (request.inputImages && request.inputImages.length > 0) {
      if (request.inputImages.length === 1) {
        apiRequestBody.image_url = request.inputImages[0];
      } else {
        apiRequestBody.image_urls = request.inputImages;
      }
    }

    const response = await fetch(`${this.baseUrl}/api/fal/image/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiRequestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start generation: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    if (result.success && result.data?.request_id) {
      return { jobId: result.data.request_id };
    }
    
    throw new Error('Invalid response format from API');
  }

  // Check status of a job
  async getJobStatus(jobId: string, nodeType: string, usedModel?: string): Promise<StatusResponse> {
    const model = usedModel || MODEL_MAP[nodeType];
    if (!model) {
      throw new Error(`Unknown model type: ${nodeType}`);
    }

    if (nodeType === 'nano_banana_pro' || nodeType === 'nano_banana_pro_edit') {
      const response = await fetch('https://buildhouse.app.n8n.cloud/webhook/get-status', {
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
      
      let backendStatus = 'processing';
      
      if (Array.isArray(result)) {
        if (result.length > 0 && result[0].images && result[0].images.length > 0) {
          backendStatus = 'completed';
        }
      } else {
        backendStatus = result.status || (result.data && result.data.status) || 'processing'; 
      }
      
      const mappedStatus = mapBackendStatus(backendStatus);
      
      let imageUrl: string | undefined;
      
      if (mappedStatus === 'completed') {
        if (Array.isArray(result) && result.length > 0) {
          const firstItem = result[0];
          if (firstItem.images && Array.isArray(firstItem.images) && firstItem.images.length > 0) {
            imageUrl = firstItem.images[0].url;
          }
        }
        else if (result.image && result.image.url) {
          imageUrl = result.image.url;
        } else if (result.result && result.result.image && result.result.image.url) {
          imageUrl = result.result.image.url;
        } else if (result.images && Array.isArray(result.images) && result.images.length > 0) {
          imageUrl = result.images[0].url;
        } else if (result.data && result.data.result && result.data.result.images && Array.isArray(result.data.result.images) && result.data.result.images.length > 0) {
          imageUrl = result.data.result.images[0].url;
        }
      }

      return {
        status: mappedStatus,
        jobId,
        result: imageUrl ? { imageUrl } : undefined,
        progress: !Array.isArray(result) ? (result.progress || 0) : 0
      };
    }

    const url = `${this.baseUrl}/api/fal/tasks/${jobId}?model=${encodeURIComponent(model)}`;

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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to save workflows');
    }

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

    if (workflow.id) {
      // Update existing
      const { data, error } = await supabase
        .from('workflows')
        .update(payload)
        .eq('id', workflow.id)
        .select()
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
    } else {
      // Create new
      const { data, error } = await supabase
        .from('workflows')
        .insert(payload)
        .select()
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

  // Delete a workflow
  async deleteWorkflow(id: string): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const apiService = new ApiService();
