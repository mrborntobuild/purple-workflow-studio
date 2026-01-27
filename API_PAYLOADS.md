# Purple Workflow Studio - API Payloads

**Base URL:** `http://localhost:3001` (dev) or your deployed URL

---

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/fal/generate` | Start a generation job |
| POST | `/api/fal/status` | Check job status |
| GET | `/api/health` | Health check |

---

## Status Check Payload

Use this after any generate request:

```json
POST /api/fal/status

{
  "request_id": "<from generate response>",
  "model": "<from generate response>"
}
```

---

# IMAGE MODELS

## Nano Banana Pro

```json
POST /api/fal/generate

{
  "nodeType": "nano_banana_pro",
  "prompt": "A cute orange cat wearing a tiny top hat",
  "num_images": 1,
  "seed": 12345,
  "aspect_ratio": "1:1",
  "output_format": "png",
  "resolution": "1K",
  "sync_mode": false,
  "enable_web_search": false
}
```

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `prompt` | string | Yes | — | 3-50000 chars |
| `num_images` | integer | No | 1 | 1-4 |
| `seed` | integer | No | — | Any integer |
| `aspect_ratio` | enum | No | "1:1" | 21:9, 16:9, 3:2, 4:3, 5:4, 1:1, 4:5, 3:4, 2:3, 9:16 |
| `output_format` | enum | No | "png" | jpeg, png, webp |
| `resolution` | enum | No | "1K" | 1K, 2K, 4K (4K costs 2x) |
| `sync_mode` | boolean | No | false | — |
| `enable_web_search` | boolean | No | false | Adds $0.015/request |

## Nano Banana Pro Edit

Requires an input image.

```json
POST /api/fal/generate

{
  "nodeType": "nano_banana_pro_edit",
  "prompt": "Add sunglasses to the cat",
  "image_urls": ["https://example.com/cat.jpg"],
  "num_images": 1,
  "seed": 12345,
  "aspect_ratio": "auto",
  "output_format": "png",
  "resolution": "1K",
  "sync_mode": false,
  "enable_web_search": false
}
```

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `prompt` | string | Yes | — | 3-50000 chars |
| `image_urls` | array | Yes | — | List of public URLs |
| `num_images` | integer | No | 1 | 1-4 |
| `seed` | integer | No | — | Any integer |
| `aspect_ratio` | enum | No | "auto" | auto, 21:9, 16:9, 3:2, 4:3, 5:4, 1:1, 4:5, 3:4, 2:3, 9:16 |
| `output_format` | enum | No | "png" | jpeg, png, webp |
| `resolution` | enum | No | "1K" | 1K, 2K, 4K |
| `sync_mode` | boolean | No | false | — |
| `enable_web_search` | boolean | No | false | — |

## Flux Pro 1.1 Ultra

```json
POST /api/fal/generate

{
  "nodeType": "flux_pro_1_1_ultra",
  "prompt": "A hyperrealistic portrait of an astronaut on Mars",
  "aspect_ratio": "16:9",
  "num_images": 1,
  "seed": 12345,
  "output_format": "jpeg",
  "enable_safety_checker": true,
  "safety_tolerance": "2",
  "enhance_prompt": false,
  "sync_mode": false,
  "raw": false,
  "image_url": null,
  "image_prompt_strength": 0.1
}
```

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `prompt` | string | Yes | — | Text description |
| `num_images` | integer | No | 1 | 1-4 |
| `seed` | integer | No | — | For reproducibility |
| `aspect_ratio` | enum | No | "16:9" | 21:9, 16:9, 4:3, 3:2, 1:1, 2:3, 3:4, 9:16, 9:21 |
| `output_format` | enum | No | "jpeg" | jpeg, png |
| `enable_safety_checker` | boolean | No | true | — |
| `safety_tolerance` | enum | No | "2" | 1-6 (1=strictest) |
| `enhance_prompt` | boolean | No | false | Auto-improve prompt |
| `sync_mode` | boolean | No | false | Return as data URI |
| `raw` | boolean | No | false | Less processed output |
| `image_url` | string | No | — | For image-guided generation |
| `image_prompt_strength` | float | No | 0.1 | 0-1, controls image influence |

## Flux Pro 1.1

```json
POST /api/fal/generate

{
  "nodeType": "flux_pro_1_1",
  "prompt": "A futuristic cityscape at sunset with flying cars",
  "num_images": 1,
  "image_size": "landscape_16_9"
}
```

## Flux Dev

```json
POST /api/fal/generate

{
  "nodeType": "flux_dev",
  "prompt": "Abstract digital art with neon colors",
  "num_images": 1,
  "guidance_scale": 3.5,
  "num_inference_steps": 28
}
```

## Flux LoRA

```json
POST /api/fal/generate

{
  "nodeType": "flux_lora",
  "prompt": "A portrait in anime style",
  "loras": [
    {
      "path": "https://huggingface.co/xxx/lora.safetensors",
      "scale": 1.0
    }
  ]
}
```

## Ideogram V3

```json
POST /api/fal/generate

{
  "nodeType": "ideogram_v3",
  "prompt": "A logo design for a coffee shop called 'Morning Brew'",
  "image_size": "square_hd",
  "num_images": 1,
  "seed": 12345,
  "style": "DESIGN",
  "style_preset": null,
  "rendering_speed": "BALANCED",
  "expand_prompt": true,
  "negative_prompt": "",
  "color_palette": null,
  "image_urls": []
}
```

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `prompt` | string | Yes | — | Text description |
| `image_size` | enum | No | "square_hd" | square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9 |
| `num_images` | integer | No | 1 | — |
| `seed` | integer | No | — | For reproducibility |
| `style` | enum | No | "AUTO" | AUTO, GENERAL, REALISTIC, DESIGN |
| `style_preset` | enum | No | — | 54 presets: 80S_ILLUSTRATION, ART_DECO, WATERCOLOR, etc. |
| `style_codes` | array | No | — | 8-char hex codes |
| `rendering_speed` | enum | No | "BALANCED" | TURBO, BALANCED, QUALITY |
| `expand_prompt` | boolean | No | true | Use MagicPrompt |
| `negative_prompt` | string | No | "" | What to exclude |
| `color_palette` | object | No | — | Preset names or hex colors with weights |
| `image_urls` | array | No | — | Style references (max 10MB total) |

## Ideogram V3 Edit

```json
POST /api/fal/generate

{
  "nodeType": "ideogram_v3_edit",
  "prompt": "Change the text to say 'Evening Brew'",
  "image_url": "https://example.com/logo.png"
}
```

## Imagen 3

```json
POST /api/fal/generate

{
  "nodeType": "imagen_3",
  "prompt": "A photorealistic image of a mountain landscape at golden hour"
}
```

## Imagen 3 Fast

```json
POST /api/fal/generate

{
  "nodeType": "imagen_3_fast",
  "prompt": "A simple illustration of a happy dog"
}
```

## Minimax Image

```json
POST /api/fal/generate

{
  "nodeType": "minimax_image",
  "prompt": "A detailed fantasy castle on a floating island"
}
```

---

# VIDEO MODELS

## Veo 2

```json
POST /api/fal/generate

{
  "nodeType": "veo_2",
  "prompt": "A timelapse of clouds moving over a mountain range",
  "aspect_ratio": "16:9",
  "duration": "8s",
  "resolution": "720p",
  "generate_audio": true,
  "negative_prompt": "",
  "seed": 12345,
  "auto_fix": true
}
```

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `prompt` | string | Yes | — | Max 20,000 chars |
| `aspect_ratio` | enum | No | "16:9" | 16:9, 9:16 |
| `duration` | enum | No | "8s" | 4s, 6s, 8s |
| `resolution` | enum | No | "720p" | 720p, 1080p, 4k |
| `generate_audio` | boolean | No | true | Include audio |
| `negative_prompt` | string | No | — | Exclusion guidance |
| `seed` | integer | No | — | For reproducibility |
| `auto_fix` | boolean | No | true | Auto-rewrite violating prompts |

## Veo 2 I2V (Image to Video)

```json
POST /api/fal/generate

{
  "nodeType": "veo_2_i2v",
  "prompt": "The clouds begin to move and the sun sets",
  "image_url": "https://example.com/mountain.jpg",
  "aspect_ratio": "16:9",
  "duration": "8s",
  "resolution": "720p",
  "generate_audio": true,
  "negative_prompt": "",
  "seed": 12345,
  "auto_fix": true
}
```

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `prompt` | string | Yes | — | Max 20,000 chars |
| `image_url` | string | Yes | — | Input image (max 8MB) |
| `aspect_ratio` | enum | No | "16:9" | 16:9, 9:16 |
| `duration` | enum | No | "8s" | 4s, 6s, 8s |
| `resolution` | enum | No | "720p" | 720p, 1080p, 4k |
| `generate_audio` | boolean | No | true | Include audio |
| `negative_prompt` | string | No | — | Exclusion guidance |
| `seed` | integer | No | — | For reproducibility |
| `auto_fix` | boolean | No | true | Auto-rewrite violating prompts |

## Veo 3.1

```json
POST /api/fal/generate

{
  "nodeType": "veo_3_1",
  "prompt": "A cinematic shot of a car driving through a desert highway",
  "aspect_ratio": "16:9",
  "duration": "8s",
  "resolution": "720p",
  "generate_audio": true,
  "negative_prompt": "",
  "seed": 12345,
  "auto_fix": true
}
```

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `prompt` | string | Yes | — | Max 20,000 chars |
| `aspect_ratio` | enum | No | "16:9" | 16:9, 9:16 |
| `duration` | enum | No | "8s" | 4s, 6s, 8s |
| `resolution` | enum | No | "720p" | 720p, 1080p, 4k |
| `generate_audio` | boolean | No | true | Include audio |
| `negative_prompt` | string | No | — | Exclusion guidance |
| `seed` | integer | No | — | For reproducibility |
| `auto_fix` | boolean | No | true | Auto-rewrite violating prompts |

## Kling 2.6 Pro

```json
POST /api/fal/generate

{
  "nodeType": "kling_2_6_pro",
  "prompt": "A person walking through a busy Tokyo street at night",
  "duration": 5,
  "aspect_ratio": "16:9"
}
```

## Kling 2.1 Pro

```json
POST /api/fal/generate

{
  "nodeType": "kling_2_1_pro",
  "prompt": "Ocean waves crashing on a rocky shore",
  "duration": 5
}
```

## Kling 2.0 Master

```json
POST /api/fal/generate

{
  "nodeType": "kling_2_0_master",
  "prompt": "A dancer performing ballet in slow motion",
  "duration": 5
}
```

## Kling 1.6 Pro

```json
POST /api/fal/generate

{
  "nodeType": "kling_1_6_pro",
  "prompt": "A butterfly landing on a flower",
  "duration": 5
}
```

## Kling 1.6 Standard

```json
POST /api/fal/generate

{
  "nodeType": "kling_1_6_standard",
  "prompt": "A cat playing with a ball of yarn",
  "duration": 5
}
```

## Hunyuan Video V1.5 I2V

```json
POST /api/fal/generate

{
  "nodeType": "hunyuan_video_v1_5_i2v",
  "prompt": "The character starts to smile and wave",
  "image_url": "https://example.com/character.jpg"
}
```

## Hunyuan Video V1.5 T2V

```json
POST /api/fal/generate

{
  "nodeType": "hunyuan_video_v1_5_t2v",
  "prompt": "A dragon flying over a medieval castle"
}
```

## Hunyuan Video I2V

```json
POST /api/fal/generate

{
  "nodeType": "hunyuan_video_i2v",
  "prompt": "Add gentle movement to the scene",
  "image_url": "https://example.com/scene.jpg"
}
```

## Luma Ray 2

```json
POST /api/fal/generate

{
  "nodeType": "luma_ray_2",
  "prompt": "A spaceship flying through an asteroid field",
  "aspect_ratio": "16:9"
}
```

## Luma Ray 2 Flash

```json
POST /api/fal/generate

{
  "nodeType": "luma_ray_2_flash",
  "prompt": "A quick animation of a bouncing ball"
}
```

## Minimax/Hailuo

```json
POST /api/fal/generate

{
  "nodeType": "minimax_hailuo",
  "prompt": "A person reading a book by a window on a rainy day [Pan right]",
  "prompt_optimizer": true
}
```

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `prompt` | string | Yes | — | Max 1500 chars |
| `prompt_optimizer` | boolean | No | true | Auto-enhance prompt |

**Camera Movements (up to 3 per prompt):**
- Truck left/right
- Pan left/right
- Push in/Pull out
- Pedestal up/down
- Tilt up/down
- Zoom in/out
- Shake
- Tracking shot
- Static shot

Example: `"A sunset over mountains [Pan left] [Zoom in]"`

## Minimax Director

```json
POST /api/fal/generate

{
  "nodeType": "minimax_director",
  "prompt": "Cinematic shot: camera slowly zooms in on a mysterious door [Push in]",
  "prompt_optimizer": true
}
```

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `prompt` | string | Yes | — | Max 1500 chars |
| `prompt_optimizer` | boolean | No | true | Auto-enhance prompt |

**Camera Movements (up to 3 per prompt):**
Use bracketed instructions: `[Pan left]`, `[Zoom in]`, `[Tracking shot]`, etc.

## Pika 2.2

```json
POST /api/fal/generate

{
  "nodeType": "pika_2_2",
  "prompt": "A cute robot waving hello",
  "image_url": "https://example.com/robot.jpg"
}
```

## LTX Video

```json
POST /api/fal/generate

{
  "nodeType": "ltx_video",
  "prompt": "A sunrise over a calm lake with birds flying"
}
```

## Wan I2V

```json
POST /api/fal/generate

{
  "nodeType": "wan_i2v",
  "prompt": "Add subtle motion to the portrait",
  "image_url": "https://example.com/portrait.jpg"
}
```

---

# UPSCALING & ENHANCEMENT

## Topaz Video

```json
POST /api/fal/generate

{
  "nodeType": "topaz_video",
  "video_url": "https://example.com/video.mp4",
  "scale": 2
}
```

## Creative Upscaler

```json
POST /api/fal/generate

{
  "nodeType": "creative_upscaler",
  "image_url": "https://example.com/low-res.jpg",
  "scale": 4,
  "creativity": 0.5,
  "model_type": "SD_1_5",
  "detail": 1,
  "shape_preservation": 0.25,
  "prompt": "",
  "prompt_suffix": " high quality, highly detailed, 8K",
  "negative_prompt": "blurry, low resolution, artifacts",
  "seed": 12345,
  "guidance_scale": 7.5,
  "num_inference_steps": 20,
  "enable_safety_checks": true,
  "skip_ccsr": false,
  "override_size_limits": false
}
```

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `image_url` | string | Yes | — | Input image URL |
| `scale` | float | No | 2 | 1-5 |
| `creativity` | float | No | 0.5 | 0-1, deviation from original |
| `model_type` | enum | No | "SD_1_5" | SD_1_5, SDXL |
| `detail` | float | No | 1 | 0-5, detail amount |
| `shape_preservation` | float | No | 0.25 | 0-3 |
| `prompt` | string | No | — | Auto-generated via BLIP2 if omitted |
| `prompt_suffix` | string | No | " high quality..." | Appended for consistency |
| `negative_prompt` | string | No | "blurry..." | What to exclude |
| `seed` | integer | No | — | For reproducibility |
| `guidance_scale` | float | No | 7.5 | 0-16, prompt adherence |
| `num_inference_steps` | integer | No | 20 | 1-200, more = better quality |
| `enable_safety_checks` | boolean | No | true | — |
| `skip_ccsr` | boolean | No | false | Skip CCSR preprocessing |
| `override_size_limits` | boolean | No | false | Allow large uploads |
| `base_model_url` | string | No | — | Custom base model |
| `additional_lora_url` | string | No | — | Custom LoRA |
| `additional_lora_scale` | float | No | 1 | LoRA strength |

## ESRGAN

```json
POST /api/fal/generate

{
  "nodeType": "esrgan",
  "image_url": "https://example.com/low-res.jpg",
  "scale": 4
}
```

## Thera

```json
POST /api/fal/generate

{
  "nodeType": "thera",
  "image_url": "https://example.com/image.jpg",
  "scale": 2
}
```

## DRCT

```json
POST /api/fal/generate

{
  "nodeType": "drct",
  "image_url": "https://example.com/image.jpg",
  "scale": 4
}
```

---

# 3D GENERATION

## Trellis

```json
POST /api/fal/generate

{
  "nodeType": "trellis",
  "image_url": "https://example.com/object.jpg"
}
```

## Hunyuan 3D V2

```json
POST /api/fal/generate

{
  "nodeType": "hunyuan_3d_v2",
  "prompt": "A detailed 3D model of a medieval sword",
  "image_url": "https://example.com/sword.jpg"
}
```

## Hunyuan 3D Mini

```json
POST /api/fal/generate

{
  "nodeType": "hunyuan_3d_mini",
  "image_url": "https://example.com/simple-object.jpg"
}
```

## Hunyuan 3D Turbo

```json
POST /api/fal/generate

{
  "nodeType": "hunyuan_3d_turbo",
  "image_url": "https://example.com/object.jpg"
}
```

---

# AUDIO / TTS

## Minimax Speech HD

```json
POST /api/fal/generate

{
  "nodeType": "minimax_speech_hd",
  "text": "Hello, welcome to Purple Workflow Studio!",
  "voice_id": "narrator"
}
```

## Minimax Speech Turbo

```json
POST /api/fal/generate

{
  "nodeType": "minimax_speech_turbo",
  "text": "This is a quick test of the speech synthesis."
}
```

## Kokoro TTS

```json
POST /api/fal/generate

{
  "nodeType": "kokoro_tts",
  "prompt": "The quick brown fox jumps over the lazy dog.",
  "voice": "af_bella",
  "speed": 1.0
}
```

| Parameter | Type | Required | Default | Options |
|-----------|------|----------|---------|---------|
| `prompt` | string | No | "" | Text to convert (note: uses `prompt` not `text`) |
| `voice` | enum | No | "af_heart" | See voice list below |
| `speed` | float | No | 1.0 | 0.1-5.0 |

**American English Voices:**
`af_heart, af_alloy, af_aoede, af_bella, af_jessica, af_kore, af_nicole, af_nova, af_river, af_sarah, af_sky, am_adam, am_echo, am_eric, am_fenrir, am_liam, am_michael, am_onyx, am_puck, am_santa`

**Other Languages:** Japanese (5), Hindi (4), British English (8), Spanish (3), French (1), Italian (2), Mandarin (8), Brazilian Portuguese (3)

## Dia TTS

```json
POST /api/fal/generate

{
  "nodeType": "dia_tts",
  "text": "Welcome to our presentation today."
}
```

## ElevenLabs TTS

```json
POST /api/fal/generate

{
  "nodeType": "elevenlabs_tts",
  "text": "This is high-quality text to speech synthesis.",
  "voice_id": "21m00Tcm4TlvDq8ikWAM"
}
```

## ElevenLabs Turbo

```json
POST /api/fal/generate

{
  "nodeType": "elevenlabs_turbo",
  "text": "Fast speech generation for quick prototyping."
}
```

## MMAudio V2

```json
POST /api/fal/generate

{
  "nodeType": "mmaudio_v2",
  "prompt": "Ambient forest sounds with birds chirping",
  "video_url": "https://example.com/forest-video.mp4"
}
```

---

# Common Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `prompt` | string | Text description of what to generate |
| `image_url` | string | Input image URL (for edit/I2V models) |
| `image_urls` | array | Multiple input images |
| `video_url` | string | Input video URL |
| `num_images` | number | Number of images to generate (default: 1) |
| `aspect_ratio` | string | Output aspect ratio (e.g., "16:9", "1:1", "9:16") |
| `image_size` | string | Output size (e.g., "square", "landscape_16_9") |
| `duration` | number | Video duration in seconds |
| `scale` | number | Upscale factor (2x, 4x) |
| `seed` | number | Random seed for reproducibility |
| `guidance_scale` | number | How closely to follow the prompt |

---

# Response Format

**Generate Response:**
```json
{
  "request_id": "abc123-def456-ghi789",
  "status": "PENDING",
  "model": "fal-ai/nano-banana-pro"
}
```

**Status Response (Processing):**
```json
{
  "status": "IN_PROGRESS",
  "request_id": "abc123-def456-ghi789",
  "progress": 0.5
}
```

**Status Response (Completed - Image):**
```json
{
  "status": "COMPLETED",
  "request_id": "abc123-def456-ghi789",
  "output_url": "https://fal.media/files/xxx/image.png",
  "raw": {
    "images": [
      { "url": "https://fal.media/files/xxx/image.png" }
    ]
  }
}
```

**Status Response (Completed - Video):**
```json
{
  "status": "COMPLETED",
  "request_id": "abc123-def456-ghi789",
  "output_url": "https://fal.media/files/xxx/video.mp4",
  "raw": {
    "video": { "url": "https://fal.media/files/xxx/video.mp4" }
  }
}
```

**Status Response (Completed - Audio):**
```json
{
  "status": "COMPLETED",
  "request_id": "abc123-def456-ghi789",
  "output_url": "https://fal.media/files/xxx/audio.mp3",
  "raw": {
    "audio": { "url": "https://fal.media/files/xxx/audio.mp3" }
  }
}
```
