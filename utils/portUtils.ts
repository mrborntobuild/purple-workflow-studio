import { NodeType } from '../types';
import { PortConfig } from '../components/nodes/BaseNode';
import { hexToRgba } from './colorUtils';

const GOOGLE_LOGO_URL = 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/logo-images/google.png';
const KLING_LOGO_URL = 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/logo-images/kling-ai.png';
const FLUX_LOGO_URL = 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/logo-images/flux%20(1).png';
const IDEOGRAM_LOGO_URL = 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/logo-images/images.png';
const MINIMAX_LOGO_URL = 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/logo-images/aQCUO7pReVYa3vYK_minimax-color.avif';
const HUNYUAN_LOGO_URL = 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/logo-images/hunyuan-color.png';
const LUMA_LOGO_URL = 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/logo-images/luma%20ai.png';
const TRELLIS_LOGO_URL = 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/logo-images/trellis%203d.png';
const META_LOGO_URL = 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/logo-images/meta%20logo.jpg';
const ELEVENLABS_LOGO_URL = 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/logo-images/elevenlabs.png';

export const getPortConfigForNode = (nodeType: NodeType): { inputs: PortConfig[]; outputs: PortConfig[] } => {
  const pink = '#c084fc', teal = '#2dd4bf', videoRed = '#f87171';
  const blue = '#38bdf8', audioYellow = '#fbbf24';

  switch (nodeType) {
    case 'any_llm': {
      // Note: This function doesn't have access to node.data, so it returns base config
      // Dynamic ports are handled in NodeRenderer.getPortConfig()
      return { 
        inputs: [
          { label: 'Prompt*', color: pink, icon: '*' }, 
          { label: 'System', color: pink }, 
          { label: 'Image', color: blue }
        ], 
        outputs: [{ label: 'Text', color: pink }] 
      };
    }
      
    // Image models inputs/outputs
    case 'image':
    case 'minimax_image':
      return { 
        inputs: [{ label: 'PROMPT', color: pink }], 
        outputs: [{ label: 'IMAGE', color: blue }] 
      };
    case 'flux_pro_1_1_ultra':
    case 'flux_pro_1_1':
    case 'flux_dev':
    case 'flux_lora':
      return { 
        inputs: [{ label: 'PROMPT', color: pink }], 
        outputs: [{ label: 'IMAGE', color: blue }] 
      };
    case 'nano_banana_pro':
    case 'imagen_3':
    case 'imagen_3_fast':
      return { 
        inputs: [{ label: 'PROMPT', color: pink }], 
        outputs: [{ label: 'IMAGE', color: blue }] 
      };
    case 'nano_banana_pro_edit':
      return { 
        inputs: [{ label: 'PROMPT', color: pink }, { label: 'IMAGE', color: blue }], 
        outputs: [{ label: 'IMAGE', color: blue }] 
      };
    case 'ideogram_v3':
      return { 
        inputs: [{ label: 'PROMPT', color: pink }], 
        outputs: [{ label: 'IMAGE', color: blue }] 
      };
    case 'ideogram_v3_edit':
      return { 
        inputs: [{ label: 'PROMPT', color: pink }, { label: 'IMAGE', color: blue }], 
        outputs: [{ label: 'IMAGE', color: blue }] 
      };
      
    // Video models configurations
    case 'hunyuan_video_v1_5_t2v':
    case 'luma_ray_2':
    case 'luma_ray_2_flash':
    case 'pika_2_2':
    case 'ltx_video':
      return { 
        inputs: [{ label: 'PROMPT', color: pink }], 
        outputs: [{ label: 'VIDEO', color: videoRed }] 
      };
    case 'kling_2_6_pro':
    case 'kling_2_1_pro':
    case 'kling_2_0_master':
    case 'kling_1_6_pro':
    case 'kling_1_6_standard':
      return { 
        inputs: [{ label: 'PROMPT', color: pink }], 
        outputs: [{ label: 'VIDEO', color: videoRed }] 
      };
    case 'veo_2':
    case 'veo_3_1':
      return { 
        inputs: [{ label: 'PROMPT', color: pink }], 
        outputs: [{ label: 'VIDEO', color: videoRed }] 
      };
      
    case 'hunyuan_video_v1_5_i2v':
    case 'hunyuan_video_i2v':
    case 'minimax_hailuo':
    case 'minimax_director':
    case 'wan_i2v':
      return { 
        inputs: [{ label: 'IMAGE', color: blue }, { label: 'PROMPT', color: pink }], 
        outputs: [{ label: 'VIDEO', color: videoRed }] 
      };
    case 'veo_2_i2v':
      return { 
        inputs: [{ label: 'IMAGE', color: blue }, { label: 'PROMPT', color: pink }], 
        outputs: [{ label: 'VIDEO', color: videoRed }] 
      };

    // Lip Sync configurations
    case 'sync_lipsync_v1':
    case 'sync_lipsync_v2':
    case 'tavus_hummingbird':
    case 'latent_sync':
      return { 
        inputs: [{ label: 'Video', color: videoRed }, { label: 'Audio', color: audioYellow }], 
        outputs: [{ label: 'Result', color: videoRed }] 
      };
    case 'kling_lipsync_a2v':
      return { 
        inputs: [{ label: 'Video', color: videoRed }, { label: 'Audio', color: audioYellow }], 
        outputs: [{ label: 'Result', color: videoRed }] 
      };
    case 'kling_lipsync_t2v':
      return { 
        inputs: [{ label: 'Video', color: videoRed }, { label: 'Text', color: pink }], 
        outputs: [{ label: 'Result', color: videoRed }] 
      };

    case 'video_frame':
      return { 
        inputs: [{ label: 'Video', color: videoRed }], 
        outputs: [{ label: 'Frame', color: teal }] 
      };

    // Upscaling & Enhancement configurations
    case 'topaz_video':
      return { 
        inputs: [{ label: 'VIDEO', color: videoRed }], 
        outputs: [{ label: 'VIDEO', color: videoRed }] 
      };
    case 'creative_upscaler':
    case 'esrgan':
    case 'thera':
    case 'drct':
      return { 
        inputs: [{ label: 'IMAGE', color: blue }], 
        outputs: [{ label: 'IMAGE', color: blue }] 
      };

    // 3D Generation configurations
    case 'trellis':
    case 'hunyuan_3d_v2':
    case 'hunyuan_3d_mini':
    case 'hunyuan_3d_turbo':
      return { 
        inputs: [{ label: 'PROMPT', color: pink }, { label: 'IMAGE', color: blue }], 
        outputs: [{ label: '3D MODEL', color: teal }] 
      };

    // Audio / TTS configurations
    case 'minimax_speech_hd':
    case 'minimax_speech_turbo':
    case 'elevenlabs_tts':
    case 'elevenlabs_turbo':
      return { 
        inputs: [{ label: 'TEXT', color: pink }], 
        outputs: [{ label: 'AUDIO', color: audioYellow }] 
      };
    case 'kokoro_tts':
    case 'dia_tts':
      return { 
        inputs: [{ label: 'TEXT', color: pink }], 
        outputs: [{ label: 'AUDIO', color: audioYellow }] 
      };
    case 'mmaudio_v2':
      return { 
        inputs: [{ label: 'TEXT', color: pink }], 
        outputs: [{ label: 'AUDIO', color: audioYellow }] 
      };

    // Utility configurations
    case 'background_remove':
      return { 
        inputs: [{ label: 'IMAGE', color: blue }], 
        outputs: [{ label: 'IMAGE', color: blue }] 
      };
    case 'image_to_svg':
      return { 
        inputs: [{ label: 'IMAGE', color: blue }], 
        outputs: [{ label: 'SVG', color: teal }] 
      };
    case 'speech_to_text':
    case 'whisper':
      return { 
        inputs: [{ label: 'AUDIO', color: audioYellow }], 
        outputs: [{ label: 'TEXT', color: pink }] 
      };

    // Quick Access nodes
    case 'prompt_enhancer':
      return {
        inputs: [{ label: 'TEXT', color: pink }],
        outputs: [{ label: 'TEXT', color: pink }]
      };

    case 'text':
    case 'basic_call':
      return {
        inputs: [],
        outputs: [{ label: 'TEXT', color: pink }]
      };

    case 'import':
      return {
        inputs: [],
        outputs: [
          { label: 'IMAGE', color: blue },
          { label: 'VIDEO', color: videoRed },
          { label: 'AUDIO', color: audioYellow },
          { label: 'FILE', color: '#94a3b8' }
        ]
      };

    case 'file':
      return {
        inputs: [],
        outputs: [{ label: 'IMAGE', color: blue }]
      };

    case 'export':
      return {
        inputs: [
          { label: 'IMAGE', color: blue },
          { label: 'VIDEO', color: videoRed },
          { label: 'AUDIO', color: audioYellow },
          { label: '3D MODEL', color: teal }
        ],
        outputs: [{ label: 'FILE', color: '#94a3b8' }]
      };

    case 'preview':
      return {
        inputs: [
          { label: 'IMAGE', color: blue },
          { label: 'VIDEO', color: videoRed }
        ],
        outputs: [
          { label: 'IMAGE', color: blue },
          { label: 'VIDEO', color: videoRed }
        ]
      };

    // Editing Tools
    case 'levels':
    case 'crop':
    case 'blur':
      return {
        inputs: [{ label: 'IMAGE', color: blue }],
        outputs: [{ label: 'IMAGE', color: blue }]
      };

    case 'compositor':
      return {
        inputs: [
          { label: 'IMAGE', color: blue },
          { label: 'VIDEO', color: videoRed },
          { label: 'MASK', color: teal }
        ],
        outputs: [
          { label: 'IMAGE', color: blue },
          { label: 'VIDEO', color: videoRed }
        ]
      };

    case 'painter':
      return {
        inputs: [{ label: 'IMAGE', color: blue }],
        outputs: [
          { label: 'IMAGE', color: blue },
          { label: 'MASK', color: teal }
        ]
      };

    case 'invert':
      return {
        inputs: [
          { label: 'IMAGE', color: blue },
          { label: 'MASK', color: teal }
        ],
        outputs: [
          { label: 'IMAGE', color: blue },
          { label: 'MASK', color: teal }
        ]
      };

    case 'resize':
    case 'channels':
      return {
        inputs: [{ label: 'IMAGE', color: blue }],
        outputs: [{ label: 'IMAGE', color: blue }]
      };

    // Text Tools
    case 'image_describer':
      return {
        inputs: [{ label: 'IMAGE', color: blue }],
        outputs: [{ label: 'TEXT', color: pink }]
      };

    case 'video_describer':
      return {
        inputs: [{ label: 'VIDEO', color: videoRed }],
        outputs: [{ label: 'TEXT', color: pink }]
      };

    case 'prompt_concatenator':
      return {
        inputs: [
          { label: 'PROMPT', color: pink },
          { label: 'PROMPT', color: pink }
        ],
        outputs: [{ label: 'TEXT', color: pink }]
      };

    // Data type nodes
    case 'number':
    case 'toggle':
    case 'list':
    case 'seed':
      return {
        inputs: [],
        outputs: [{ label: 'DATA', color: '#94a3b8' }]
      };
    
    // Array node - accepts TEXT input
    case 'array':
      return {
        inputs: [{ label: 'TEXT', color: pink }],
        outputs: [{ label: 'ARRAY', color: '#94a3b8' }]
      };
    
    // Options node - accepts ARRAY input
    case 'options':
      return {
        inputs: [{ label: 'OPTIONS', color: '#94a3b8' }],
        outputs: [{ label: 'TEXT', color: pink }]
      };

    // Lip Sync - sad_talker
    case 'sad_talker':
      return {
        inputs: [
          { label: 'VIDEO', color: videoRed },
          { label: 'AUDIO', color: audioYellow }
        ],
        outputs: [{ label: 'VIDEO', color: videoRed }]
      };

    // Sticky Note - no ports (annotation only)
    case 'sticky_note':
      return {
        inputs: [],
        outputs: []
      };

    // Style Guide - dynamic ports handled in NodeRenderer/App
    case 'style_guide':
      return {
        inputs: [
          { label: 'Background', color: blue, dataType: 'image' }
        ],
        outputs: [
          { label: 'IMAGE', color: blue }
        ]
      };

    default:
      return { 
        inputs: [], 
        outputs: [{ label: 'Output', color: '#94a3b8' }] 
      };
  }
};

/**
 * Gets the edge style configuration based on source port color
 * @param sourceNodeType - Type of the source node
 * @param sourcePortIndex - Index of the output port
 * @param options - Optional styling options
 * @returns React Flow edge style object
 */
export const getEdgeStyleFromPort = (
  sourceNodeType: NodeType,
  sourcePortIndex: number = 0,
  options: {
    opacity?: number;
    strokeWidth?: number;
    defaultColor?: string;
  } = {}
): { stroke: string; strokeWidth: number } => {
  const { opacity = 0.6, strokeWidth = 2, defaultColor = '#ffffff' } = options;
  
  const portConfig = getPortConfigForNode(sourceNodeType);
  const outputPort = portConfig.outputs[sourcePortIndex];
  const portColor = outputPort?.color || defaultColor;
  
  return {
    stroke: hexToRgba(portColor, opacity),
    strokeWidth
  };
};