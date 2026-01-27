// Local development server for API routes
// Run with: node server.cjs

const http = require('http');
const https = require('https');
const fs = require('fs');

// Load .env file FIRST
fs.readFileSync('.env', 'utf8').split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && !key.startsWith('#') && key.trim()) {
    process.env[key.trim()] = value.join('=').trim();
  }
});

const PORT = 3000;
const FAL_API_KEY = process.env.FAL_API_KEY;

// Model mapping
const MODEL_MAP = {
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

// Helper to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

// Helper to make HTTPS request
function fetchFal(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'https://queue.fal.run');
    console.log(`[fetchFal] ${options.method || 'GET'} ${url.href}`);
    const req = https.request(url, {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

// Request handler
async function handleRequest(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  console.log(`[${req.method}] ${path}`);

  try {
    // Health check
    if (path === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        hasFalKey: !!FAL_API_KEY
      }));
      return;
    }

    // Generate endpoint
    if (path === '/api/fal/generate' && req.method === 'POST') {
      const body = await parseBody(req);
      const { nodeType, ...input } = body;

      let model = MODEL_MAP[nodeType];
      if (!model) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Unknown model: ${nodeType}` }));
        return;
      }

      // Dynamic routing: switch to image-to-video endpoint when image_url is provided
      const hasImage = input.image_url || (input.image_urls && input.image_urls.length > 0);
      if (hasImage) {
        // Map text-to-video endpoints to image-to-video equivalents
        const t2vToI2v = {
          'fal-ai/kling-video/v2.6/pro/text-to-video': 'fal-ai/kling-video/v2.6/pro/image-to-video',
          'fal-ai/kling-video/v2/master/text-to-video': 'fal-ai/kling-video/v2/master/image-to-video',
          'fal-ai/kling-video/v1.6/standard/text-to-video': 'fal-ai/kling-video/v1.6/standard/image-to-video',
          'fal-ai/veo2': 'fal-ai/veo2/image-to-video',
          'fal-ai/veo3.1': 'fal-ai/veo3.1/image-to-video',
          'fal-ai/hunyuan-video': 'fal-ai/hunyuan-video/image-to-video',
          'fal-ai/luma-dream-machine/ray-2': 'fal-ai/luma-dream-machine/ray-2/image-to-video',
          'fal-ai/luma-dream-machine/ray-2-flash': 'fal-ai/luma-dream-machine/ray-2-flash/image-to-video',
        };
        if (t2vToI2v[model]) {
          console.log(`[Generate] Image detected, switching from ${model} to ${t2vToI2v[model]}`);
          model = t2vToI2v[model];
        }
      }

      console.log(`[Generate] Model: ${model}`);
      console.log(`[Generate] Received body:`, JSON.stringify(body, null, 2));
      console.log(`[Generate] Prompt: "${input.prompt}" (length: ${input.prompt?.length || 0})`);

      const result = await fetchFal(`/${model}`, {
        method: 'POST',
        body: input
      });

      console.log(`[Generate] fal.ai HTTP ${result.status}, response:`, JSON.stringify(result.data, null, 2));

      // Check for errors from fal.ai
      if (result.status >= 400 || !result.data.request_id) {
        console.log(`[Generate] Error from fal.ai: HTTP ${result.status}`);
        res.writeHead(result.status >= 400 ? result.status : 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: result.data.detail || result.data.message || result.data.error || `fal.ai error: ${JSON.stringify(result.data)}`,
          status: 'FAILED'
        }));
        return;
      }

      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        request_id: result.data.request_id,
        status: 'PENDING',
        model: model
      }));
      return;
    }

    // Status endpoint
    if (path === '/api/fal/status' && req.method === 'POST') {
      const body = await parseBody(req);
      const { request_id, model } = body;

      if (!request_id || !model) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'request_id and model required' }));
        return;
      }

      console.log(`[Status] ${model} / ${request_id}`);

      // For status checks, use BASE model (first 2 path segments: namespace/model-name)
      // fal.ai requires the base model for queue status/result endpoints
      // e.g., "fal-ai/flux-pro/v1.1-ultra" -> "fal-ai/flux-pro"
      // e.g., "fal-ai/nano-banana-pro/edit" -> "fal-ai/nano-banana-pro"
      const modelParts = model.split('/');
      const baseModel = modelParts.slice(0, 2).join('/');
      console.log(`[Status] Using base model for status: ${baseModel}`);

      // Check status
      const statusResult = await fetchFal(`/${baseModel}/requests/${request_id}/status`);
      console.log(`[Status] HTTP ${statusResult.status}, fal.ai response:`, JSON.stringify(statusResult.data, null, 2));

      // Check for HTTP errors from fal.ai
      if (statusResult.status >= 400) {
        console.log(`[Status] Error from fal.ai: HTTP ${statusResult.status}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'FAILED',
          request_id,
          error: `fal.ai returned HTTP ${statusResult.status}: ${typeof statusResult.data === 'string' ? statusResult.data : JSON.stringify(statusResult.data)}`
        }));
        return;
      }

      const falStatus = statusResult.data.status || statusResult.data.state || 'IN_PROGRESS';

      if (falStatus === 'COMPLETED') {
        // Fetch full result (use baseModel, not the subpath)
        const fullResult = await fetchFal(`/${baseModel}/requests/${request_id}`);

        let output_url = null;
        if (fullResult.data.images?.[0]?.url) {
          output_url = fullResult.data.images[0].url;
        } else if (fullResult.data.image?.url) {
          output_url = fullResult.data.image.url;
        } else if (fullResult.data.video?.url) {
          output_url = fullResult.data.video.url;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'COMPLETED',
          request_id,
          output_url,
          raw: fullResult.data
        }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: falStatus,
        request_id,
        progress: statusResult.data.progress || 0
      }));
      return;
    }

    // 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));

  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}

const server = http.createServer(handleRequest);
server.listen(PORT, () => {
  console.log(`\n🚀 API Server running at http://localhost:${PORT}`);
  console.log(`   FAL_API_KEY: ${FAL_API_KEY ? '✓ Set' : '✗ Missing'}\n`);
  console.log('Endpoints:');
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   POST http://localhost:${PORT}/api/fal/generate`);
  console.log(`   POST http://localhost:${PORT}/api/fal/status\n`);
});
