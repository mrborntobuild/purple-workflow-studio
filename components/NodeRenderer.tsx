
import React, { useRef } from 'react';
/* Fix: Added missing Box import from lucide-react */
import {
  Sliders, Palette, Layers, Sparkles,
  Image as ImageIcon, Crop as CropIcon,
  Droplets, RefreshCcw, ListFilter, Video, Type, Wand2, PlusCircle, Brain, Camera, FileVideo, File,
  Hash, ToggleRight, List as ListIcon, Dice5, Braces, Zap, Film, Clapperboard,
  Smile, UserCircle, MessageCircle, Waves, Volume2, Mic2, Music,
  Activity, BoxSelect, Box, Maximize, Maximize2, Scissors, Binary, Calculator, Globe, MapPin,
  Terminal, Timer, Palette as PaletteIcon, AudioLines, Radio, Bird,
  Play, Flag
} from 'lucide-react';
import { CanvasNode, Edge } from '../types';

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
import { BaseNode } from './nodes/BaseNode';
import { PromptEnhancerNode } from './nodes/PromptEnhancerNode';
import { PromptConcatenatorNode } from './nodes/PromptConcatenatorNode';
import { AnyLLMNode } from './nodes/AnyLLMNode';
import { ImageDescriberNode } from './nodes/ImageDescriberNode';
import { VideoDescriberNode } from './nodes/VideoDescriberNode';
import { TextNode } from './nodes/TextNode';
import { ImageNode, ImageNodeRef } from './nodes/ImageNode';
import { ImportNode } from './nodes/ImportNode';
import { FileNode } from './nodes/FileNode';
import { ExportNode } from './nodes/ExportNode';
import { PreviewNode } from './nodes/PreviewNode';
import { LevelsNode } from './nodes/LevelsNode';
import { CompositorNode } from './nodes/CompositorNode';
import { PainterNode } from './nodes/PainterNode';
import { CropNode } from './nodes/CropNode';
import { BlurNode } from './nodes/BlurNode';
import { InvertNode } from './nodes/InvertNode';
import { ChannelsNode } from './nodes/ChannelsNode';
import { VideoFrameNode } from './nodes/VideoFrameNode';
import { NumberNode } from './nodes/NumberNode';
import { ToggleNode } from './nodes/ToggleNode';
import { ListNode } from './nodes/ListNode';
import { SeedNode } from './nodes/SeedNode';
import { ArrayNode } from './nodes/ArrayNode';
import { OptionsNode } from './nodes/OptionsNode';
import { StickyNoteNode } from './nodes/StickyNoteNode';
import { ModulePlaceholderNode } from './nodes/ModulePlaceholderNode';
import { VideoNode } from './nodes/VideoNode';
import { StyleGuideNode } from './nodes/StyleGuideNode';
import { GroupNode } from './nodes/GroupNode';
import { StartWorkflowNode } from './nodes/StartWorkflowNode';
import { OutputNode } from './nodes/OutputNode';

interface NodeRendererProps {
  node: CanvasNode;
  selected?: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
  onRun?: (id: string) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onOutputPortMouseDown?: (portIndex: number, e: React.MouseEvent) => void;
  edges?: Edge[];
  nodes?: CanvasNode[];
  workflowId?: string; // Add workflowId prop
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({ node, selected, onDelete, onUpdate, onRun, onMouseDown, onOutputPortMouseDown, edges = [], nodes = [], workflowId }) => {
  const commonProps = { onUpdate: (data: any) => onUpdate(node.id, data) };
  const imageNodeRef = useRef<ImageNodeRef>(null);

  // Helper function to get input image URL from connected edge
  const getInputImageUrl = (portIndex: number): string | undefined => {
    const inputEdge = edges.find(e => e.target === node.id && e.targetPortIndex === portIndex);
    if (!inputEdge) return undefined;
    const sourceNode = nodes.find(n => n.id === inputEdge.source);
    return sourceNode?.data.imageUrl;
  };

  // Helper function to get input text content from connected edge
  const getInputText = (portIndex: number): string | undefined => {
    const inputEdge = edges.find(e => e.target === node.id && e.targetPortIndex === portIndex);
    if (!inputEdge) return undefined;
    const sourceNode = nodes.find(n => n.id === inputEdge.source);
    return sourceNode?.data.content;
  };

  // Helper function to get input array data from connected edge
  const getInputArray = (portIndex: number): string[] | undefined => {
    const inputEdge = edges.find(e => e.target === node.id && e.targetPortIndex === portIndex);
    if (!inputEdge) return undefined;
    const sourceNode = nodes.find(n => n.id === inputEdge.source);
    if (sourceNode?.data.arrayItems && Array.isArray(sourceNode.data.arrayItems)) {
      return sourceNode.data.arrayItems;
    }
    return undefined;
  };

  const renderContent = () => {
    switch (node.type) {
      case 'any_llm': return <AnyLLMNode 
        content={node.data.content || ''} 
        status={node.data.status} 
        mediaInputCount={node.data.panelSettings?.mediaInputCount || 0}
        onRun={() => onRun?.(node.id)} 
        {...commonProps} 
      />;
      case 'image_describer': return <ImageDescriberNode content={node.data.content || ''} status={node.data.status} onRun={() => onRun?.(node.id)} {...commonProps} />;
      case 'video_describer': return <VideoDescriberNode content={node.data.content || ''} status={node.data.status} onRun={() => onRun?.(node.id)} {...commonProps} />;
      case 'prompt_enhancer': return <PromptEnhancerNode content={node.data.content || ''} status={node.data.status} onRun={() => onRun?.(node.id)} {...commonProps} />;
      case 'prompt_concatenator': {
        const textInputPortCount = node.data.panelSettings?.textInputPortCount || 0;
        const textInputs: string[] = [];
        
        // Get text from dynamic ports (starting from port index 2, after prompt1 and prompt2)
        for (let i = 0; i < textInputPortCount; i++) {
          const text = getInputText(2 + i);
          if (text) textInputs.push(text);
        }
        
        return <PromptConcatenatorNode 
          prompt1={getInputText(0)} 
          prompt2={getInputText(1)}
          textInputs={textInputs}
          manualText={node.data.manualText || ''}
          textInputPortCount={textInputPortCount}
          {...commonProps} 
        />;
      }
      case 'text': return <TextNode content={node.data.content || ''} {...commonProps} />;
      case 'basic_call': return <TextNode content={node.data.content || ''} {...commonProps} />;
      case 'image': return <ImageNode imageUrl={node.data.imageUrl} content={node.data.content || ''} status={node.data.status} onRun={() => onRun?.(node.id)} {...commonProps} />;
      case 'import': return <ImportNode content={node.data.content || ''} imageUrl={node.data.imageUrl} workflowId={workflowId} nodeId={node.id} {...commonProps} />;
      case 'file': return <FileNode content={node.data.content || ''} imageUrl={node.data.imageUrl} workflowId={workflowId} nodeId={node.id} {...commonProps} />;
      case 'export': return <ExportNode />;
      case 'preview': return <PreviewNode imageUrl={node.data.imageUrl} />;
      case 'levels': return <LevelsNode inputImageUrl={getInputImageUrl(0)} {...commonProps} />;
      case 'compositor': return <CompositorNode inputImageUrl={getInputImageUrl(0)} overlayImageUrl={getInputImageUrl(1)} {...commonProps} />;
      case 'painter': return <PainterNode inputImageUrl={getInputImageUrl(0)} {...commonProps} />;
      case 'crop': return <CropNode inputImageUrl={getInputImageUrl(0)} {...commonProps} />;
      case 'blur': return <BlurNode inputImageUrl={getInputImageUrl(0)} {...commonProps} />;
      case 'invert': return <InvertNode inputImageUrl={getInputImageUrl(0)} {...commonProps} />;
      case 'channels': return <ChannelsNode />;
      case 'video_frame': return <VideoFrameNode />;
      case 'number': return <NumberNode />;
      case 'toggle': return <ToggleNode />;
      case 'list': return <ListNode />;
      case 'seed': return <SeedNode />;
      case 'array': return <ArrayNode inputText={getInputText(0)} {...commonProps} />;
      case 'options': return <OptionsNode inputArray={getInputArray(0)} {...commonProps} />;
      case 'style_guide': {
        // Default to 4 numbered layers if not set
        const layerCount = node.data.panelSettings?.layerCount ?? 4;
        
        // Collect all input images (Background + Layers)
        // Background is index 0, Layer 1 is index 1, etc.
        const inputImageUrls: (string | undefined)[] = [];
        for (let i = 0; i <= layerCount; i++) {
          inputImageUrls.push(getInputImageUrl(i));
        }

        return (
          <StyleGuideNode
            inputImageUrls={inputImageUrls}
            layerCount={layerCount}
            {...commonProps}
          />
        );
      }
      
      // New Module Placeholders with Specific Icons
      case 'kling_lipsync_a2v': return <ModulePlaceholderNode label="Kling A2V" icon={<img src={KLING_LOGO_URL} alt="Kling AI" className="w-6 h-6 object-contain" />} buttonLabel="Generate" />;
      case 'kling_lipsync_t2v': return <ModulePlaceholderNode label="Kling T2V" icon={<img src={KLING_LOGO_URL} alt="Kling AI" className="w-6 h-6 object-contain" />} buttonLabel="Generate" />;
      case 'sync_lipsync_v1': return <ModulePlaceholderNode label="Sync V1" icon={<Activity size={24} />} />;
      case 'sync_lipsync_v2': return <ModulePlaceholderNode label="Sync V2" icon={<Waves size={24} />} />;
      case 'tavus_hummingbird': return <ModulePlaceholderNode label="Tavus Hummingbird" icon={<Bird size={24} />} buttonLabel="Sync" />;
      case 'latent_sync': return <ModulePlaceholderNode label="LatentSync" icon={<Sparkles size={24} />} />;
      
      // Upscaling & Enhancement
      case 'topaz_video': return <ModulePlaceholderNode label="Topaz Video" icon={<Video size={24} />} buttonLabel="Upscale" />;
      case 'creative_upscaler': return <ModulePlaceholderNode label="Creative Upscaler" icon={<Maximize2 size={24} />} buttonLabel="Upscale" />;
      case 'esrgan': return <ModulePlaceholderNode label="ESRGAN" icon={<Sparkles size={24} />} buttonLabel="Upscale" />;
      case 'thera': return <ModulePlaceholderNode label="Thera" icon={<Zap size={24} />} buttonLabel="Upscale" />;
      case 'drct': return <ModulePlaceholderNode label="DRCT" icon={<Maximize size={24} />} buttonLabel="Upscale" />;
      
      // 3D Generation
      case 'trellis': return <ModulePlaceholderNode label="Trellis" icon={<img src={TRELLIS_LOGO_URL} alt="Trellis" className="w-6 h-6 object-contain" />} buttonLabel="Generate" />;
      case 'hunyuan_3d_v2': return <ModulePlaceholderNode label="Hunyuan 3D V2" icon={<img src={HUNYUAN_LOGO_URL} alt="Hunyuan" className="w-6 h-6 object-contain" />} buttonLabel="Generate" />;
      case 'hunyuan_3d_mini': return <ModulePlaceholderNode label="Hunyuan 3D Mini" icon={<img src={HUNYUAN_LOGO_URL} alt="Hunyuan" className="w-6 h-6 object-contain" />} buttonLabel="Generate" />;
      case 'hunyuan_3d_turbo': return <ModulePlaceholderNode label="Hunyuan 3D Turbo" icon={<img src={HUNYUAN_LOGO_URL} alt="Hunyuan" className="w-6 h-6 object-contain" />} buttonLabel="Generate" />;
      
      // Audio / TTS
      case 'minimax_speech_hd': return <ModulePlaceholderNode label="Minimax Speech HD" icon={<img src={MINIMAX_LOGO_URL} alt="Minimax" className="w-6 h-6 object-contain" />} buttonLabel="Generate" />;
      case 'minimax_speech_turbo': return <ModulePlaceholderNode label="Minimax Speech Turbo" icon={<img src={MINIMAX_LOGO_URL} alt="Minimax" className="w-6 h-6 object-contain" />} buttonLabel="Generate" />;
      case 'kokoro_tts': return <ModulePlaceholderNode label="Kokoro TTS" icon={<Mic2 size={24} />} buttonLabel="Generate" />;
      case 'dia_tts': return <ModulePlaceholderNode label="Dia TTS" icon={<Mic2 size={24} />} buttonLabel="Generate" />;
      case 'elevenlabs_tts': return <ModulePlaceholderNode label="ElevenLabs TTS" icon={<img src={ELEVENLABS_LOGO_URL} alt="ElevenLabs" className="w-6 h-6 object-contain" />} buttonLabel="Generate" />;
      case 'elevenlabs_turbo': return <ModulePlaceholderNode label="ElevenLabs Turbo" icon={<img src={ELEVENLABS_LOGO_URL} alt="ElevenLabs" className="w-6 h-6 object-contain" />} buttonLabel="Generate" />;
      case 'mmaudio_v2': return <ModulePlaceholderNode label="MMAudio V2" icon={<img src={META_LOGO_URL} alt="Meta" className="w-6 h-6 object-contain" />} buttonLabel="Generate" />;
      
      // Utility
      case 'background_remove': return <ModulePlaceholderNode label="Background Remove" icon={<Scissors size={24} />} buttonLabel="Process" />;
      case 'image_to_svg': return <ModulePlaceholderNode label="Image to SVG" icon={<ImageIcon size={24} />} buttonLabel="Convert" />;
      case 'speech_to_text': return <ModulePlaceholderNode label="Speech to Text" icon={<Mic2 size={24} />} buttonLabel="Transcribe" />;
      case 'whisper': return <ModulePlaceholderNode label="Whisper" icon={<Mic2 size={24} />} buttonLabel="Transcribe" />;
      
      // Image Models
      case 'nano_banana_pro':
      case 'nano_banana_pro_edit':
      case 'flux_pro_1_1_ultra':
      case 'flux_pro_1_1':
      case 'flux_dev':
      case 'flux_lora':
      case 'ideogram_v3':
      case 'ideogram_v3_edit':
      case 'imagen_3':
      case 'imagen_3_fast':
      case 'minimax_image':
        return <ImageNode 
          ref={imageNodeRef}
          imageUrl={node.data.imageUrl} 
          content={node.data.content || ''} 
          status={node.data.status} 
          progress={node.data.progress}
          onRun={() => onRun?.(node.id)} 
          imageInputCount={node.data.panelSettings?.imageInputCount || 0}
          nodeType={node.type}
          nodeId={node.id}
          edges={edges}
          nodes={nodes}
          panelSettings={node.data.panelSettings}
          {...commonProps} 
        />;
      
      // Video Models - use VideoNode with onRun
      case 'veo_2':
      case 'veo_2_i2v':
      case 'veo_3_1':
      case 'kling_2_6_pro':
      case 'kling_2_1_pro':
      case 'kling_2_0_master':
      case 'kling_1_6_pro':
      case 'kling_1_6_standard':
      case 'hunyuan_video_v1_5_i2v':
      case 'hunyuan_video_v1_5_t2v':
      case 'hunyuan_video_i2v':
      case 'luma_ray_2':
      case 'luma_ray_2_flash':
      case 'minimax_hailuo':
      case 'minimax_director':
      case 'pika_2_2':
      case 'ltx_video':
      case 'wan_i2v':
        return (
          <VideoNode
            videoUrl={node.data.videoUrl}
            thumbnailUrl={node.data.thumbnailUrl}
            content={node.data.content || ''}
            status={node.data.status}
            progress={node.data.progress}
            onUpdate={(data) => onUpdate(node.id, data)}
            onRun={onRun ? () => onRun(node.id) : undefined}
            nodeType={node.type}
            nodeId={node.id}
            aspectRatio={node.data.panelSettings?.aspectRatio}
          />
        );

      case 'sad_talker':
        return <ModulePlaceholderNode label={node.data.label} icon={<Zap size={24} />} />;

      // Workflow nodes
      case 'start_workflow': {
        // Count connected triggers (edges going out from this node)
        const connectedTriggers = edges.filter(e => e.source === node.id).length;
        return <StartWorkflowNode connectedTriggers={connectedTriggers} />;
      }
      case 'output': {
        // Count connected results (edges coming into this node)
        const connectedResults = edges.filter(e => e.target === node.id).length;
        return <OutputNode connectedResults={connectedResults} />;
      }

      default:
        return <div className="py-12 text-gray-600 italic text-sm text-center">Module Coming Soon</div>;
    }
  };

  const getPortConfig = () => {
    const pink = '#c084fc', teal = '#2dd4bf', videoRed = '#f87171';
    const blue = '#38bdf8', audioYellow = '#fbbf24';

    // Get dynamic image input count from node data
    const imageInputCount = node.data.panelSettings?.imageInputCount || 0;

    switch (node.type) {
      case 'any_llm': {
        const mediaInputCount = node.data.panelSettings?.mediaInputCount || 0;
        const inputs = [
          { label: 'Prompt*', color: pink, icon: '*' }, 
          { label: 'System', color: pink }, 
          { label: 'Image', color: blue }
        ];
        
        // Add dynamic IMAGE input ports
        for (let i = 0; i < mediaInputCount; i++) {
          inputs.push({ label: 'Image', color: blue });
        }
        
        return { 
          headerIcon: <Brain size={16} />,
          inputs, 
          outputs: [{ label: 'Text', color: pink }] 
        };
      }
      
      // Image models inputs/outputs - with dynamic IMAGE ports
      case 'image': {
        const inputs = [{ label: 'PROMPT', color: pink }];
        for (let i = 0; i < imageInputCount; i++) {
          inputs.push({ label: 'IMAGE', color: blue });
        }
        return { headerIcon: <ImageIcon size={16} />, inputs, outputs: [{ label: 'IMAGE', color: blue }] };
      }
      case 'minimax_image': {
        const inputs = [{ label: 'PROMPT', color: pink }];
        for (let i = 0; i < imageInputCount; i++) {
          inputs.push({ label: 'IMAGE', color: blue });
        }
        return { headerIcon: <img src={MINIMAX_LOGO_URL} alt="Minimax" className="w-4 h-4 object-contain" />, inputs, outputs: [{ label: 'IMAGE', color: blue }] };
      }
      case 'flux_pro_1_1_ultra':
      case 'flux_pro_1_1':
      case 'flux_dev':
      case 'flux_lora': {
        const inputs = [{ label: 'PROMPT', color: pink }];
        for (let i = 0; i < imageInputCount; i++) {
          inputs.push({ label: 'IMAGE', color: blue });
        }
        return { headerIcon: <img src={FLUX_LOGO_URL} alt="Flux" className="w-4 h-4 object-contain" />, inputs, outputs: [{ label: 'IMAGE', color: blue }] };
      }
      case 'nano_banana_pro':
      case 'imagen_3':
      case 'imagen_3_fast': {
        const inputs = [{ label: 'PROMPT', color: pink }];
        for (let i = 0; i < imageInputCount; i++) {
          inputs.push({ label: 'IMAGE', color: blue });
        }
        return { headerIcon: <img src={GOOGLE_LOGO_URL} alt="Google" className="w-4 h-4 object-contain" />, inputs, outputs: [{ label: 'IMAGE', color: blue }] };
      }
      case 'nano_banana_pro_edit': {
        const inputs = [{ label: 'PROMPT', color: pink }, { label: 'IMAGE', color: blue }];
        // Add additional dynamic IMAGE ports beyond the first one (up to 4 total)
        // imageInputCount represents additional ports beyond the base one
        const additionalPorts = Math.min(imageInputCount, 3); // Max 3 additional (total 4)
        for (let i = 0; i < additionalPorts; i++) {
          inputs.push({ label: 'IMAGE', color: blue });
        }
        return { headerIcon: <img src={GOOGLE_LOGO_URL} alt="Google" className="w-4 h-4 object-contain" />, inputs, outputs: [{ label: 'IMAGE', color: blue }] };
      }
      case 'ideogram_v3': {
        const inputs = [{ label: 'PROMPT', color: pink }];
        for (let i = 0; i < imageInputCount; i++) {
          inputs.push({ label: 'IMAGE', color: blue });
        }
        return { headerIcon: <img src={IDEOGRAM_LOGO_URL} alt="Ideogram" className="w-4 h-4 object-contain" />, inputs, outputs: [{ label: 'IMAGE', color: blue }] };
      }
      case 'ideogram_v3_edit': {
        const inputs = [{ label: 'PROMPT', color: pink }, { label: 'IMAGE', color: blue }];
        // Add additional dynamic IMAGE ports beyond the first one
        for (let i = 0; i < imageInputCount; i++) {
          inputs.push({ label: 'IMAGE', color: blue });
        }
        return { headerIcon: <img src={IDEOGRAM_LOGO_URL} alt="Ideogram" className="w-4 h-4 object-contain" />, inputs, outputs: [{ label: 'IMAGE', color: blue }] };
      }
      
      // Video models configurations
      case 'hunyuan_video_v1_5_t2v':
        return { headerIcon: <img src={HUNYUAN_LOGO_URL} alt="Hunyuan" className="w-4 h-4 object-contain" />, inputs: [{ label: 'PROMPT', color: pink }], outputs: [{ label: 'VIDEO', color: videoRed }] };
      case 'luma_ray_2':
      case 'luma_ray_2_flash':
        return { headerIcon: <img src={LUMA_LOGO_URL} alt="Luma AI" className="w-4 h-4 object-contain" />, inputs: [{ label: 'PROMPT', color: pink }], outputs: [{ label: 'VIDEO', color: videoRed }] };
      case 'ltx_video':
        return { headerIcon: <Film size={16} />, inputs: [{ label: 'PROMPT', color: pink }], outputs: [{ label: 'VIDEO', color: videoRed }] };
      case 'pika_2_2':
        return { headerIcon: <Film size={16} />, inputs: [{ label: 'IMAGE', color: blue }, { label: 'PROMPT', color: pink }], outputs: [{ label: 'VIDEO', color: videoRed }] };
      // Kling models - all support image input
      case 'kling_2_6_pro':
      case 'kling_2_1_pro':
      case 'kling_2_0_master':
      case 'kling_1_6_pro':
      case 'kling_1_6_standard':
        return { headerIcon: <img src={KLING_LOGO_URL} alt="Kling AI" className="w-4 h-4 object-contain" />, inputs: [{ label: 'IMAGE', color: blue }, { label: 'PROMPT', color: pink }], outputs: [{ label: 'VIDEO', color: videoRed }] };
      case 'veo_2':
      case 'veo_3_1':
        return { headerIcon: <img src={GOOGLE_LOGO_URL} alt="Google" className="w-4 h-4 object-contain" />, inputs: [{ label: 'PROMPT', color: pink }], outputs: [{ label: 'VIDEO', color: videoRed }] };
      
      case 'hunyuan_video_v1_5_i2v':
      case 'hunyuan_video_i2v':
        return { headerIcon: <img src={HUNYUAN_LOGO_URL} alt="Hunyuan" className="w-4 h-4 object-contain" />, inputs: [{ label: 'IMAGE', color: blue }, { label: 'PROMPT', color: pink }], outputs: [{ label: 'VIDEO', color: videoRed }] };
      case 'wan_i2v':
        return { headerIcon: <Video size={16} />, inputs: [{ label: 'IMAGE', color: blue }, { label: 'PROMPT', color: pink }], outputs: [{ label: 'VIDEO', color: videoRed }] };
      case 'minimax_hailuo':
      case 'minimax_director':
        return { headerIcon: <img src={MINIMAX_LOGO_URL} alt="Minimax" className="w-4 h-4 object-contain" />, inputs: [{ label: 'IMAGE', color: blue }, { label: 'PROMPT', color: pink }], outputs: [{ label: 'VIDEO', color: videoRed }] };
      case 'veo_2_i2v':
        return { headerIcon: <img src={GOOGLE_LOGO_URL} alt="Google" className="w-4 h-4 object-contain" />, inputs: [{ label: 'IMAGE', color: blue }, { label: 'PROMPT', color: pink }], outputs: [{ label: 'VIDEO', color: videoRed }] };

      // Lip Sync configurations
      case 'sync_lipsync_v1':
      case 'sync_lipsync_v2':
      case 'tavus_hummingbird':
      case 'latent_sync':
        return { headerIcon: <Waves size={16} />, inputs: [{ label: 'Video', color: videoRed }, { label: 'Audio', color: audioYellow }], outputs: [{ label: 'Result', color: videoRed }] };
      case 'kling_lipsync_a2v':
        return { headerIcon: <img src={KLING_LOGO_URL} alt="Kling AI" className="w-4 h-4 object-contain" />, inputs: [{ label: 'Video', color: videoRed }, { label: 'Audio', color: audioYellow }], outputs: [{ label: 'Result', color: videoRed }] };
      case 'kling_lipsync_t2v':
        return { headerIcon: <img src={KLING_LOGO_URL} alt="Kling AI" className="w-4 h-4 object-contain" />, inputs: [{ label: 'Video', color: videoRed }, { label: 'Text', color: pink }], outputs: [{ label: 'Result', color: videoRed }] };

      case 'video_frame':
        return { headerIcon: <Video size={16} />, inputs: [{ label: 'Video', color: videoRed }], outputs: [{ label: 'Frame', color: teal }] };

      // Upscaling & Enhancement configurations
      case 'topaz_video':
        return { headerIcon: <Video size={16} />, inputs: [{ label: 'VIDEO', color: videoRed }], outputs: [{ label: 'VIDEO', color: videoRed }] };
      case 'creative_upscaler':
      case 'esrgan':
      case 'thera':
      case 'drct':
        return { headerIcon: <Maximize2 size={16} />, inputs: [{ label: 'IMAGE', color: blue }], outputs: [{ label: 'IMAGE', color: blue }] };

      // 3D Generation configurations
      case 'trellis':
        return { headerIcon: <img src={TRELLIS_LOGO_URL} alt="Trellis" className="w-4 h-4 object-contain" />, inputs: [{ label: 'PROMPT', color: pink }, { label: 'IMAGE', color: blue }], outputs: [{ label: '3D MODEL', color: teal }] };
      case 'hunyuan_3d_v2':
      case 'hunyuan_3d_mini':
      case 'hunyuan_3d_turbo':
        return { headerIcon: <img src={HUNYUAN_LOGO_URL} alt="Hunyuan" className="w-4 h-4 object-contain" />, inputs: [{ label: 'PROMPT', color: pink }, { label: 'IMAGE', color: blue }], outputs: [{ label: '3D MODEL', color: teal }] };

      // Audio / TTS configurations
      case 'minimax_speech_hd':
      case 'minimax_speech_turbo':
        return { headerIcon: <img src={MINIMAX_LOGO_URL} alt="Minimax" className="w-4 h-4 object-contain" />, inputs: [{ label: 'TEXT', color: pink }], outputs: [{ label: 'AUDIO', color: audioYellow }] };
      case 'elevenlabs_tts':
      case 'elevenlabs_turbo':
        return { headerIcon: <img src={ELEVENLABS_LOGO_URL} alt="ElevenLabs" className="w-4 h-4 object-contain" />, inputs: [{ label: 'TEXT', color: pink }], outputs: [{ label: 'AUDIO', color: audioYellow }] };
      case 'kokoro_tts':
      case 'dia_tts':
        return { headerIcon: <Mic2 size={16} />, inputs: [{ label: 'TEXT', color: pink }], outputs: [{ label: 'AUDIO', color: audioYellow }] };
      case 'mmaudio_v2':
        return { headerIcon: <img src={META_LOGO_URL} alt="Meta" className="w-4 h-4 object-contain" />, inputs: [{ label: 'TEXT', color: pink }], outputs: [{ label: 'AUDIO', color: audioYellow }] };

      // Utility configurations
      case 'background_remove':
        return { headerIcon: <Scissors size={16} />, inputs: [{ label: 'IMAGE', color: blue }], outputs: [{ label: 'IMAGE', color: blue }] };
      case 'image_to_svg':
        return { headerIcon: <ImageIcon size={16} />, inputs: [{ label: 'IMAGE', color: blue }], outputs: [{ label: 'SVG', color: teal }] };
      case 'speech_to_text':
      case 'whisper':
        return { headerIcon: <Mic2 size={16} />, inputs: [{ label: 'AUDIO', color: audioYellow }], outputs: [{ label: 'TEXT', color: pink }] };

      // Editing Tools configurations
      case 'levels':
        return { headerIcon: <Layers size={16} />, inputs: [{ label: 'IMAGE', color: blue }], outputs: [{ label: 'IMAGE', color: blue }] };
      case 'blur':
        return { headerIcon: <Droplets size={16} />, inputs: [{ label: 'IMAGE', color: blue }], outputs: [{ label: 'IMAGE', color: blue }] };
      case 'crop':
        return { headerIcon: <CropIcon size={16} />, inputs: [{ label: 'IMAGE', color: blue }], outputs: [{ label: 'IMAGE', color: blue }] };
      case 'invert':
        return { headerIcon: <RefreshCcw size={16} />, inputs: [{ label: 'IMAGE', color: blue }], outputs: [{ label: 'IMAGE', color: blue }] };
      case 'compositor':
        return { headerIcon: <ImageIcon size={16} />, inputs: [{ label: 'IMAGE', color: blue }, { label: 'IMAGE', color: blue }], outputs: [{ label: 'IMAGE', color: blue }] };
      case 'painter':
        return { headerIcon: <Palette size={16} />, inputs: [{ label: 'IMAGE', color: blue }], outputs: [{ label: 'IMAGE', color: blue }] };

      // Text node - has TRIGGER input for workflow, outputs TEXT type
      case 'text':
      case 'basic_call':
        return { headerIcon: <Type size={16} />, inputs: [{ label: 'TRIGGER', color: '#22c55e' }], outputs: [{ label: 'TEXT', color: pink }] };

      // Array node - accepts TEXT input, outputs ARRAY
      case 'array':
        return { headerIcon: <Braces size={16} />, inputs: [{ label: 'TEXT', color: pink }], outputs: [{ label: 'ARRAY', color: '#94a3b8' }] };

      // Options node - accepts ARRAY input, outputs TEXT (selected option)
      case 'options':
        return { headerIcon: <ListFilter size={16} />, inputs: [{ label: 'OPTIONS', color: '#94a3b8' }], outputs: [{ label: 'TEXT', color: pink }] };

      // Prompt enhancer
      case 'prompt_enhancer':
        return { headerIcon: <Wand2 size={16} />, inputs: [{ label: 'TEXT', color: pink }], outputs: [{ label: 'TEXT', color: pink }] };

      // Prompt combiner - accepts multiple prompts, outputs combined PROMPT
      case 'prompt_concatenator': {
        const textInputPortCount = node.data.panelSettings?.textInputPortCount || 0;
        const inputs = [
          { label: 'PROMPT', color: pink },
          { label: 'PROMPT', color: pink }
        ];

        // Add dynamic PROMPT input ports
        for (let i = 0; i < textInputPortCount; i++) {
          inputs.push({ label: 'PROMPT', color: pink });
        }

        return {
          headerIcon: <PlusCircle size={16} />,
          inputs,
          outputs: [{ label: 'PROMPT', color: pink }],
          inputPortPosition: 'top' as const
        };
      }

      // File node - has TRIGGER input for workflow, outputs IMAGE type
      case 'file':
        return { headerIcon: <File size={16} />, inputs: [{ label: 'TRIGGER', color: '#22c55e' }], outputs: [{ label: 'IMAGE', color: blue }] };

      // Style Guide node - accepts Background + dynamic Layer inputs (all IMAGE type)
      case 'style_guide': {
        const layerCount = node.data.panelSettings?.layerCount ?? 4;
        const inputs = [];

        // Add Background Input (Port 0) - IMAGE type with custom label
        inputs.push({ label: 'Background', color: blue, dataType: 'image' as const });

        // Add Layer Inputs (Ports 1 to layerCount) - IMAGE type with numbered labels
        for (let i = 1; i <= layerCount; i++) {
          inputs.push({ label: `Layer ${i}`, color: blue, dataType: 'image' as const });
        }

        return {
          headerIcon: <PaletteIcon size={16} />,
          inputs,
          outputs: [{ label: 'IMAGE', color: blue }]
        };
      }

      // Workflow nodes
      case 'start_workflow':
        return {
          headerIcon: <Play size={16} className="text-green-500" />,
          inputs: [],
          outputs: [{ label: 'TRIGGER', color: '#22c55e' }]
        };

      case 'output':
        return {
          headerIcon: <Flag size={16} className="text-orange-500" />,
          inputs: [
            { label: 'RESULT', color: '#22c55e' } // Single green input for any result
          ],
          outputs: []
        };

      default:
        return { outputs: [{ label: 'Output', color: '#94a3b8' }] };
    }
  };

  // Handle output port clicks for IMAGE ports
  const handleOutputPortClick = (portIndex: number, e: React.MouseEvent) => {
    // Check if this is an IMAGE output port and node has imageUrl
    const portConfig = getPortConfig();
    const outputPort = portConfig.outputs?.[portIndex];
    
    if (outputPort?.label === 'IMAGE' && node.data.imageUrl && node.data.status !== 'loading') {
      e.stopPropagation();
      // Try to open modal via ref if available
      if (imageNodeRef.current) {
        imageNodeRef.current.openModal();
      }
      return;
    }
    
    // Otherwise, use the default handler
    if (onOutputPortMouseDown) {
      onOutputPortMouseDown(portIndex, e);
    }
  };

  // Sticky notes are rendered standalone without BaseNode (no ports needed)
  if (node.type === 'sticky_note') {
    return (
      <StickyNoteNode
        id={node.id}
        label={node.data.label || 'Sticky Note'}
        content={node.data.content || ''}
        noteColor={node.data.noteColor || 'yellow'}
        noteWidth={node.data.noteWidth}
        noteHeight={node.data.noteHeight}
        selected={selected}
        onDelete={onDelete}
        onUpdate={commonProps.onUpdate}
        onMouseDown={onMouseDown}
      />
    );
  }

  // Group nodes are rendered standalone
  if (node.type === 'group') {
    return (
      <GroupNode
        id={node.id}
        data={{
          label: node.data.label,
          width: node.data.width,
          height: node.data.height
        }}
        selected={selected}
        onUpdate={commonProps.onUpdate}
      />
    );
  }

  return (
    <BaseNode 
      id={node.id} 
      type={node.type} 
      label={node.data.label} 
      selected={selected} 
      onDelete={onDelete} 
      onMouseDown={onMouseDown}
      onOutputPortMouseDown={handleOutputPortClick}
      {...getPortConfig()}
    >
      {renderContent()}
    </BaseNode>
  );
};
