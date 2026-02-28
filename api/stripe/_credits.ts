// Credit cost map: FAL model ID → credits to deduct per run
// 1 credit = $0.01. Cost = FAL price × 1.5, rounded up to nearest integer.
// For per-second models (video), we estimate based on a standard generation.

export const MODEL_CREDIT_COSTS: Record<string, number> = {
  // Image models
  'fal-ai/nano-banana-pro':         23,   // $0.15 × 1.5 = $0.225
  'fal-ai/nano-banana-pro/edit':    23,   // $0.15 × 1.5 = $0.225
  'fal-ai/flux-pro/v1.1-ultra':     9,    // $0.06 × 1.5 = $0.09
  'fal-ai/flux-pro/v1.1':           6,    // $0.04 × 1.5 = $0.06
  'fal-ai/flux/dev':                4,    // $0.025 × 1.5 = $0.0375
  'fal-ai/flux-lora':               4,    // $0.025 × 1.5 = $0.0375
  'fal-ai/ideogram/v3':             10,   // $0.06 avg × 1.5 = $0.09
  'fal-ai/ideogram/v3/edit':        10,   // $0.06 avg × 1.5 = $0.09
  'fal-ai/imagen3':                 8,    // $0.05 × 1.5 = $0.075
  'fal-ai/imagen3/fast':            4,    // $0.025 × 1.5 = $0.0375
  'fal-ai/minimax/image-01':        5,    // $0.03 × 1.5 = $0.045

  // Video models (estimated for standard ~5s generation)
  'fal-ai/veo2':                    375,  // $0.50/s × 5s × 1.5 = $3.75
  'fal-ai/veo2/image-to-video':     375,  // $0.50/s × 5s × 1.5 = $3.75
  'fal-ai/veo3.1':                  300,  // $0.40/s × 5s × 1.5 = $3.00
  'fal-ai/veo3.1/image-to-video':   300,  // $0.40/s × 5s × 1.5 = $3.00
  'fal-ai/kling-video/v2.6/pro/text-to-video':  53,  // $0.07/s × 5s × 1.5 = $0.525
  'fal-ai/kling-video/v2.6/pro/image-to-video': 53,
  'fal-ai/kling-video/v2.1/pro/image-to-video': 72,  // $0.095/s × 5s × 1.5 = $0.7125
  'fal-ai/kling-video/v2/master/text-to-video':  75,  // $0.10/s × 5s × 1.5 = $0.75
  'fal-ai/kling-video/v2/master/image-to-video': 75,
  'fal-ai/kling-video/v1.6/pro/text-to-video':   72,
  'fal-ai/kling-video/v1.6/pro/image-to-video':  72,
  'fal-ai/kling-video/v1.6/standard/text-to-video':  38,  // $0.05/s × 5s × 1.5 = $0.375
  'fal-ai/kling-video/v1.6/standard/image-to-video': 38,
  'fal-ai/hunyuan-video':           60,   // $0.40 × 1.5 = $0.60
  'fal-ai/hunyuan-video/image-to-video': 60,
  'fal-ai/hunyuan-video-v1.5/image-to-video': 60,
  'fal-ai/luma-dream-machine/ray-2': 75,  // $0.50 × 1.5 = $0.75
  'fal-ai/luma-dream-machine/ray-2/image-to-video': 75,
  'fal-ai/luma-dream-machine/ray-2-flash': 38, // $0.25 × 1.5 = $0.375
  'fal-ai/luma-dream-machine/ray-2-flash/image-to-video': 38,
  'fal-ai/minimax/video-01-live':   75,   // $0.50 × 1.5 = $0.75
  'fal-ai/minimax/video-01-director': 90, // $0.60 × 1.5 = $0.90
  'fal-ai/pika/v2.2':              45,   // $0.30 avg × 1.5 = $0.45
  'fal-ai/ltx-video':              3,    // $0.02 × 1.5 = $0.03
  'fal-ai/wan/v2.1/image-to-video': 38,  // $0.05/s × 5s × 1.5 = $0.375

  // Lipsync (estimated ~5s)
  'fal-ai/kling-video/lipsync/audio-to-video': 75, // $0.10/s × 5s × 1.5 = $0.75
  'fal-ai/kling-video/lipsync/text-to-video':  75,
  'fal-ai/sync-lipsync':           60,   // $0.08/s × 5s × 1.5 = $0.60
  'fal-ai/sync-lipsync/v2':        60,
  'fal-ai/latent-sync':            38,   // $0.05/s × 5s × 1.5 = $0.375
  'fal-ai/sadtalker':              23,   // $0.03/s × 5s × 1.5 = $0.225
  'fal-ai/tavus/hummingbird':      113,  // $0.15/s × 5s × 1.5 = $1.125

  // Upscale
  'fal-ai/topaz-video':            75,   // $0.10/s × 5s × 1.5 = $0.75
  'fal-ai/creative-upscaler':      3,    // $0.02 × 1.5 = $0.03
  'fal-ai/esrgan':                 1,    // ~$0.001 × 1.5 (minimum 1 credit)
  'fal-ai/thera':                  3,    // $0.02 × 1.5 = $0.03
  'fal-ai/drct':                   3,    // $0.02 × 1.5 = $0.03

  // 3D
  'fal-ai/trellis':                3,    // $0.02 × 1.5 = $0.03
  'fal-ai/hunyuan3d/v2':           72,   // $0.48 textured × 1.5 = $0.72
  'fal-ai/hunyuan3d/mini':         12,   // $0.08 × 1.5 = $0.12
  'fal-ai/hunyuan3d/turbo':        6,    // $0.04 × 1.5 = $0.06

  // Audio / TTS (estimated per typical generation)
  'fal-ai/minimax/speech-hd':      5,    // $0.03 × 1.5 = $0.045
  'fal-ai/minimax/speech-turbo':   3,    // $0.02 × 1.5 = $0.03
  'fal-ai/kokoro-tts':             3,    // $0.02 × 1.5 = $0.03
  'fal-ai/dia-tts':                6,    // $0.04 × 1.5 = $0.06
  'fal-ai/elevenlabs/tts':         8,    // $0.05 × 1.5 = $0.075
  'fal-ai/elevenlabs/turbo':       5,    // $0.03 × 1.5 = $0.045
  'fal-ai/mmaudio/v2':             8,    // $0.05 × 1.5 = $0.075

  // Utility
  'fal-ai/birefnet':               0,    // FREE
  'fal-ai/image-to-svg':           2,    // $0.01 × 1.5 = $0.015
  'fal-ai/whisper':                1,    // ~$0.001 × 1.5 (minimum 1)
};

export function getModelCreditCost(falModel: string): number {
  return MODEL_CREDIT_COSTS[falModel] ?? 5; // Default 5 credits for unknown models
}
