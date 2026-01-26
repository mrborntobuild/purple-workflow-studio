import type { VercelRequest, VercelResponse } from '@vercel/node';

// Model mapping from frontend node types to FAL.ai model IDs
// Synced with server.cjs for consistency between local and production
const MODEL_MAP: Record<string, string> = {
  // Image models
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

  // Video models
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

  // Lipsync
  'kling_lipsync_a2v': 'fal-ai/kling-video/lipsync/audio-to-video',
  'kling_lipsync_t2v': 'fal-ai/kling-video/lipsync/text-to-video',
  'sync_lipsync_v1': 'fal-ai/sync-lipsync',
  'sync_lipsync_v2': 'fal-ai/sync-lipsync/v2',
  'latent_sync': 'fal-ai/latent-sync',
  'sad_talker': 'fal-ai/sadtalker',
  'tavus_hummingbird': 'fal-ai/tavus/hummingbird',

  // Upscale
  'topaz_video': 'fal-ai/topaz-video',
  'creative_upscaler': 'fal-ai/creative-upscaler',
  'esrgan': 'fal-ai/esrgan',
  'thera': 'fal-ai/thera',
  'drct': 'fal-ai/drct',

  // 3D
  'trellis': 'fal-ai/trellis',
  'hunyuan_3d_v2': 'fal-ai/hunyuan3d/v2',
  'hunyuan_3d_mini': 'fal-ai/hunyuan3d/mini',
  'hunyuan_3d_turbo': 'fal-ai/hunyuan3d/turbo',

  // Audio
  'minimax_speech_hd': 'fal-ai/minimax/speech-hd',
  'minimax_speech_turbo': 'fal-ai/minimax/speech-turbo',
  'kokoro_tts': 'fal-ai/kokoro-tts',
  'dia_tts': 'fal-ai/dia-tts',
  'elevenlabs_tts': 'fal-ai/elevenlabs/tts',
  'elevenlabs_turbo': 'fal-ai/elevenlabs/turbo',
  'mmaudio_v2': 'fal-ai/mmaudio/v2',

  // Utility
  'background_remove': 'fal-ai/birefnet',
  'image_to_svg': 'fal-ai/image-to-svg',
  'speech_to_text': 'fal-ai/whisper',
  'whisper': 'fal-ai/whisper',
};

// Dynamic routing: text-to-video endpoints switch to image-to-video when image is provided
const T2V_TO_I2V_MAP: Record<string, string> = {
  'fal-ai/kling-video/v2.6/pro/text-to-video': 'fal-ai/kling-video/v2.6/pro/image-to-video',
  'fal-ai/kling-video/v2/master/text-to-video': 'fal-ai/kling-video/v2/master/image-to-video',
  'fal-ai/kling-video/v1.6/standard/text-to-video': 'fal-ai/kling-video/v1.6/standard/image-to-video',
  'fal-ai/veo2': 'fal-ai/veo2/image-to-video',
  'fal-ai/veo3.1': 'fal-ai/veo3.1/image-to-video',
  'fal-ai/hunyuan-video': 'fal-ai/hunyuan-video/image-to-video',
  'fal-ai/luma-dream-machine/ray-2': 'fal-ai/luma-dream-machine/ray-2/image-to-video',
  'fal-ai/luma-dream-machine/ray-2-flash': 'fal-ai/luma-dream-machine/ray-2-flash/image-to-video',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const FAL_API_KEY = process.env.FAL_API_KEY;

  if (!FAL_API_KEY) {
    console.error('FAL_API_KEY is not configured');
    return res.status(500).json({ error: 'Server configuration error: FAL_API_KEY missing' });
  }

  try {
    const { model, nodeType, ...input } = req.body;

    // Get FAL model ID from node type or use provided model
    let falModel = model || MODEL_MAP[nodeType];

    if (!falModel) {
      return res.status(400).json({
        error: `Unknown model type: ${nodeType || 'not provided'}`,
        availableModels: Object.keys(MODEL_MAP)
      });
    }

    // Dynamic routing: switch to image-to-video endpoint when image_url is provided
    const hasImage = input.image_url || (input.image_urls && input.image_urls.length > 0);
    if (hasImage && T2V_TO_I2V_MAP[falModel]) {
      console.log(`[FAL Generate] Image detected, switching from ${falModel} to ${T2V_TO_I2V_MAP[falModel]}`);
      falModel = T2V_TO_I2V_MAP[falModel];
    }

    console.log(`[FAL Generate] Model: ${falModel}, Input:`, JSON.stringify(input).slice(0, 200));

    // Submit job to FAL.ai queue
    const response = await fetch(`https://queue.fal.run/${falModel}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[FAL Generate] Error: ${response.status} ${errorText}`);
      return res.status(response.status).json({
        error: `FAL API error: ${response.status}`,
        details: errorText
      });
    }

    const result = await response.json();
    console.log(`[FAL Generate] Success:`, result);

    // Return the request_id for polling
    return res.status(200).json({
      request_id: result.request_id,
      status: 'PENDING',
      model: falModel,
    });

  } catch (error) {
    console.error('[FAL Generate] Error:', error);
    return res.status(500).json({
      error: 'Failed to submit generation job',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
