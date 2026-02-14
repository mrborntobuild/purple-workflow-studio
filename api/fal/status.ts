import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Allow both GET and POST for flexibility
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const FAL_API_KEY = process.env.FAL_API_KEY;

  if (!FAL_API_KEY) {
    console.error('FAL_API_KEY is not configured');
    return res.status(500).json({ error: 'Server configuration error: FAL_API_KEY missing' });
  }

  try {
    // Get parameters from body (POST) or query (GET)
    const request_id = req.body?.request_id || req.query.request_id;
    const model = req.body?.model || req.query.model;

    if (!request_id) {
      return res.status(400).json({ error: 'request_id is required' });
    }

    if (!model) {
      return res.status(400).json({ error: 'model is required' });
    }

    console.log(`[FAL Status] Checking: ${model} / ${request_id}`);

    // For status checks, use BASE model (first 2 path segments: namespace/model-name)
    // fal.ai requires the base model for queue status/result endpoints
    // e.g., "fal-ai/flux-pro/v1.1-ultra" -> "fal-ai/flux-pro"
    // e.g., "fal-ai/nano-banana-pro/edit" -> "fal-ai/nano-banana-pro"
    const modelParts = model.split('/');
    const baseModel = modelParts.slice(0, 2).join('/');
    console.log(`[FAL Status] Using base model for status: ${baseModel}`);

    // Check status from FAL.ai
    const statusResponse = await fetch(
      `https://queue.fal.run/${baseModel}/requests/${request_id}/status`,
      {
        headers: {
          'Authorization': `Key ${FAL_API_KEY}`,
        },
      }
    );

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error(`[FAL Status] Error: ${statusResponse.status} ${errorText}`);
      return res.status(statusResponse.status).json({
        error: `FAL API error: ${statusResponse.status}`,
        details: errorText
      });
    }

    const statusResult = await statusResponse.json();
    console.log(`[FAL Status] Status:`, statusResult.status);

    // If completed, fetch the full result (use baseModel, not the subpath)
    if (statusResult.status === 'COMPLETED') {
      const resultResponse = await fetch(
        `https://queue.fal.run/${baseModel}/requests/${request_id}`,
        {
          headers: {
            'Authorization': `Key ${FAL_API_KEY}`,
          },
        }
      );

      if (resultResponse.ok) {
        const fullResult = await resultResponse.json();
        console.log(`[FAL Status] Completed result keys:`, Object.keys(fullResult));

        // Extract the output URL based on the result structure
        let outputUrl = null;
        let outputData = null;

        // Handle different response formats
        if (fullResult.images && fullResult.images.length > 0) {
          // Image generation result
          outputUrl = fullResult.images[0].url;
          outputData = fullResult.images;
        } else if (fullResult.video && fullResult.video.url) {
          // Video generation result
          outputUrl = fullResult.video.url;
          outputData = fullResult.video;
        } else if (fullResult.audio && fullResult.audio.url) {
          // Audio generation result
          outputUrl = fullResult.audio.url;
          outputData = fullResult.audio;
        } else if (fullResult.output && fullResult.output.url) {
          // Generic output
          outputUrl = fullResult.output.url;
          outputData = fullResult.output;
        } else if (fullResult.mesh && fullResult.mesh.url) {
          // 3D mesh result
          outputUrl = fullResult.mesh.url;
          outputData = fullResult.mesh;
        } else if (fullResult.image && fullResult.image.url) {
          // Single image result
          outputUrl = fullResult.image.url;
          outputData = fullResult.image;
        }

        // Extract thumbnail URL from video response
        let thumbnailUrl = null;
        if (fullResult.video?.thumbnail_url) {
          thumbnailUrl = fullResult.video.thumbnail_url;
        } else if (fullResult.thumbnail?.url) {
          thumbnailUrl = fullResult.thumbnail.url;
        }

        return res.status(200).json({
          status: 'COMPLETED',
          request_id,
          output_url: outputUrl,
          thumbnail_url: thumbnailUrl,
          output: outputData,
          raw: fullResult,
        });
      }
    }

    // Return current status for non-completed jobs
    return res.status(200).json({
      status: statusResult.status,
      request_id,
      queue_position: statusResult.queue_position,
      progress: statusResult.progress,
    });

  } catch (error) {
    console.error('[FAL Status] Error:', error);
    return res.status(500).json({
      error: 'Failed to check job status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
