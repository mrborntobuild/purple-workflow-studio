export interface NanoBananaProRequest {
  prompt: string;
  modelType: 'nano_banana_pro' | 'nano_banana_pro_edit';
  imageUrls?: string[]; // Optional for nano_banana_pro, required for nano_banana_pro_edit
  aspectRatio?: string;
  outputFormat?: string;
  resolution?: string;
  negativePrompt?: string;
  seed?: string;
  seedRandom?: boolean;
  syncMode?: boolean;
  limitGenerations?: boolean;
  enableWebSearch?: boolean;
}

export interface NanoBananaProResponse {
  requestId: string;
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  imageUrl?: string;
  progress?: number;
  usedModel?: string;
}

class NanoBananaProService {
  private readonly API_BASE = 'http://localhost:3002';

  /**
   * Get the fal.ai model identifier based on model type
   */
  private getModelIdentifier(modelType: 'nano_banana_pro' | 'nano_banana_pro_edit'): string {
    return modelType === 'nano_banana_pro'
      ? 'fal-ai/nano-banana-pro'
      : 'fal-ai/nano-banana-pro/edit';
  }

  /**
   * Build payload for local API - flat structure matching your API format
   */
  private buildPayload(request: NanoBananaProRequest, model: string): Record<string, any> {
    const payload: Record<string, any> = {
      model,
      waitForCompletion: false,
      prompt: request.prompt,
      num_images: 1,
    };

    // Map aspect ratio
    if (request.aspectRatio && request.aspectRatio !== 'Default') {
      payload.aspect_ratio = request.aspectRatio === 'auto' ? 'auto' : request.aspectRatio;
    } else {
      payload.aspect_ratio = '1:1';
    }

    // Map output format
    if (request.outputFormat && request.outputFormat !== 'Default') {
      payload.output_format = request.outputFormat;
    } else {
      payload.output_format = 'png';
    }

    // Map resolution
    if (request.resolution && request.resolution !== 'Default') {
      payload.resolution = request.resolution;
    } else {
      payload.resolution = '1K';
    }

    // Map negative prompt
    if (request.negativePrompt) {
      payload.negative_prompt = request.negativePrompt;
    }

    // Map seed (only if not random)
    if (request.seed && !request.seedRandom) {
      payload.seed = request.seed;
    }

    // Map sync_mode, limit_generations, enable_web_search conditionally based on model
    // Only include these for nano_banana_pro_edit (edit model)
    if (request.modelType === 'nano_banana_pro_edit') {
      if (request.syncMode !== undefined) {
        payload.sync_mode = request.syncMode;
      } else {
        payload.sync_mode = false;
      }

      if (request.limitGenerations !== undefined) {
        payload.limit_generations = request.limitGenerations;
      } else {
        payload.limit_generations = false;
      }

      if (request.enableWebSearch !== undefined) {
        payload.enable_web_search = request.enableWebSearch;
      } else {
        payload.enable_web_search = false;
      }
    }

    // Add image_urls if provided
    if (request.imageUrls && request.imageUrls.length > 0) {
      payload.image_urls = request.imageUrls;
    }

    return payload;
  }

  /**
   * Start image generation with Nano Banana Pro (base or edit) - calls local API
   */
  async startGeneration(request: NanoBananaProRequest): Promise<{ requestId: string; usedModel: string }> {
    // nano_banana_pro_edit always requires images
    if (request.modelType === 'nano_banana_pro_edit') {
      if (!request.imageUrls || request.imageUrls.length === 0) {
        throw new Error('Nano Banana Pro Edit requires at least one input image');
      }
    }

    // Get the correct model identifier
    const model = this.getModelIdentifier(request.modelType);

    // Build payload
    const payload = this.buildPayload(request, model);

    // Call local API
    const response = await fetch(`${this.API_BASE}/api/fal/image/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start generation: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    // Handle response format: { success: true, data: { request_id } }
    if (!result.success || !result.data?.request_id) {
      throw new Error('Invalid response format from API');
    }

    const requestId = result.data.request_id;
    return { requestId, usedModel: model };
  }

  /**
   * Check the status of a generation job - calls local API
   */
  async getStatus(requestId: string, usedModel: string): Promise<NanoBananaProResponse> {
    // Check status using local API endpoint
    const statusUrl = `${this.API_BASE}/api/fal/tasks/${requestId}?model=${encodeURIComponent(usedModel)}`;
    const statusResponse = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      throw new Error(`Failed to get status: ${statusResponse.status} ${errorText}`);
    }

    const result = await statusResponse.json();

    // Handle response format:
    // Completed: { success: true, data: { request_id, status: "COMPLETED", result: { data: { image: { url: "..." } } } } }
    // In Progress: { success: true, data: { request_id, status: "IN_PROGRESS" } }
    
    if (!result.success || !result.data) {
      throw new Error('Invalid response format from status API');
    }

    const backendStatus = result.data.status?.toUpperCase() || 'IN_PROGRESS';
    
    // Map status
    let mappedStatus: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    if (backendStatus === 'FAILED') {
      mappedStatus = 'FAILED';
    } else if (backendStatus === 'IN_QUEUE') {
      mappedStatus = 'IN_QUEUE';
    } else if (backendStatus === 'COMPLETED') {
      mappedStatus = 'COMPLETED';
    } else {
      mappedStatus = 'IN_PROGRESS';
    }

    let imageUrl: string | undefined;
    
    // Extract image URL if completed
    // Response format: { success: true, data: { request_id, status: "COMPLETED", result: { data: { images: [{ url: "..." }] } } } }
    if (mappedStatus === 'COMPLETED' && result.data.result) {
      // Check the correct path first: result.data.result.data.images[0].url
      if (result.data.result.data?.images && Array.isArray(result.data.result.data.images) && result.data.result.data.images.length > 0) {
        imageUrl = result.data.result.data.images[0].url;
      } 
      // Fallback to other possible paths
      else if (result.data.result.images && Array.isArray(result.data.result.images) && result.data.result.images.length > 0) {
        imageUrl = result.data.result.images[0].url;
      } else if (result.data.result.image?.url) {
        imageUrl = result.data.result.image.url;
      } else if (result.data.result.data?.image?.url) {
        imageUrl = result.data.result.data.image.url;
      }
    }

    return {
      requestId,
      status: mappedStatus,
      imageUrl,
      progress: mappedStatus === 'COMPLETED' ? 100 : 0,
      usedModel,
    };
  }
}

export const nanoBananaProService = new NanoBananaProService();

// Keep backward compatibility
export const nanoBananaProEditService = nanoBananaProService;
