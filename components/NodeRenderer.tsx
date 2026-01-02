
import React from 'react';
/* Fix: Added missing Box import from lucide-react */
import { 
  Sliders, Palette, Layers, Sparkles, 
  Image as ImageIcon, Crop as CropIcon, 
  Droplets, RefreshCcw, ListFilter, Video, Type, Wand2, PlusCircle, Brain, Camera, FileVideo,
  Hash, ToggleRight, List as ListIcon, Dice5, Braces, Zap, Film, Clapperboard,
  Smile, UserCircle, MessageCircle, Waves, Volume2, Mic2, Music, 
  Activity, BoxSelect, Box, Maximize, Scissors, Binary, Calculator, Globe, MapPin, 
  Terminal, Timer, Palette as PaletteIcon, AudioLines, Radio, Bird
} from 'lucide-react';
import { CanvasNode } from '../types';
import { BaseNode } from './nodes/BaseNode';
import { PromptEnhancerNode } from './nodes/PromptEnhancerNode';
import { PromptConcatenatorNode } from './nodes/PromptConcatenatorNode';
import { AnyLLMNode } from './nodes/AnyLLMNode';
import { ImageDescriberNode } from './nodes/ImageDescriberNode';
import { VideoDescriberNode } from './nodes/VideoDescriberNode';
import { TextNode } from './nodes/TextNode';
import { ImageNode } from './nodes/ImageNode';
import { ImportNode } from './nodes/ImportNode';
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
import { ModulePlaceholderNode } from './nodes/ModulePlaceholderNode';

interface NodeRendererProps {
  node: CanvasNode;
  selected?: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
  onRun?: (id: string) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({ node, selected, onDelete, onUpdate, onRun, onMouseDown }) => {
  const commonProps = { onUpdate: (data: any) => onUpdate(node.id, data) };

  const renderContent = () => {
    switch (node.type) {
      case 'any_llm': return <AnyLLMNode content={node.data.content || ''} status={node.data.status} onRun={() => onRun?.(node.id)} {...commonProps} />;
      case 'image_describer': return <ImageDescriberNode content={node.data.content || ''} status={node.data.status} onRun={() => onRun?.(node.id)} {...commonProps} />;
      case 'video_describer': return <VideoDescriberNode content={node.data.content || ''} status={node.data.status} onRun={() => onRun?.(node.id)} {...commonProps} />;
      case 'prompt_enhancer': return <PromptEnhancerNode content={node.data.content || ''} status={node.data.status} onRun={() => onRun?.(node.id)} {...commonProps} />;
      case 'prompt_concatenator': return <PromptConcatenatorNode />;
      case 'text': return <TextNode content={node.data.content || ''} {...commonProps} />;
      case 'image': return <ImageNode imageUrl={node.data.imageUrl} content={node.data.content || ''} status={node.data.status} onRun={() => onRun?.(node.id)} {...commonProps} />;
      case 'import': return <ImportNode content={node.data.content || ''} {...commonProps} />;
      case 'export': return <ExportNode />;
      case 'preview': return <PreviewNode imageUrl={node.data.imageUrl} />;
      case 'levels': return <LevelsNode />;
      case 'compositor': return <CompositorNode />;
      case 'painter': return <PainterNode />;
      case 'crop': return <CropNode />;
      case 'blur': return <BlurNode />;
      case 'invert': return <InvertNode />;
      case 'channels': return <ChannelsNode />;
      case 'video_frame': return <VideoFrameNode />;
      case 'number': return <NumberNode />;
      case 'toggle': return <ToggleNode />;
      case 'list': return <ListNode />;
      case 'seed': return <SeedNode />;
      case 'array': return <ArrayNode />;
      
      // New Module Placeholders with Specific Icons
      case 'kling_lipsync_a2v': return <ModulePlaceholderNode label="Kling A2V" icon={<Radio size={24} />} buttonLabel="Generate" />;
      case 'kling_lipsync_t2v': return <ModulePlaceholderNode label="Kling T2V" icon={<Type size={24} />} buttonLabel="Generate" />;
      case 'sync_lipsync_v1': return <ModulePlaceholderNode label="Sync V1" icon={<Activity size={24} />} />;
      case 'sync_lipsync_v2': return <ModulePlaceholderNode label="Sync V2" icon={<Waves size={24} />} />;
      case 'tavus_hummingbird': return <ModulePlaceholderNode label="Tavus Hummingbird" icon={<Bird size={24} />} buttonLabel="Sync" />;
      case 'latent_sync': return <ModulePlaceholderNode label="LatentSync" icon={<Sparkles size={24} />} />;
      
      // Image Models
      case 'nano_banana_pro':
        return <ImageNode imageUrl={node.data.imageUrl} content={node.data.content || ''} status={node.data.status} onRun={() => onRun?.(node.id)} {...commonProps} />;
      
      // Default placeholder for rest of models
      case 'flux_pro_1_1_ultra':
      case 'flux_pro_1_1':
      case 'flux_dev':
      case 'flux_lora':
      case 'ideogram_v3':
      case 'ideogram_v3_edit':
      case 'imagen_3':
      case 'imagen_3_fast':
      case 'minimax_image':
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
      case 'sad_talker':
        return <ModulePlaceholderNode label={node.data.label} icon={<Zap size={24} />} />;
        
      default:
        return <div className="py-12 text-gray-600 italic text-sm text-center">Module Coming Soon</div>;
    }
  };

  const getPortConfig = () => {
    const pink = '#c084fc', teal = '#2dd4bf', videoRed = '#f87171';
    const blue = '#38bdf8', audioYellow = '#fbbf24';

    switch (node.type) {
      case 'any_llm':
        return { headerIcon: <Brain size={16} />, inputs: [{ label: 'Prompt*', color: pink, icon: '*' }, { label: 'System', color: pink }, { label: 'Media', color: teal }], outputs: [{ label: 'Text', color: pink }] };
      
      // Image models inputs/outputs
      case 'image':
      case 'nano_banana_pro':
      case 'flux_pro_1_1_ultra':
      case 'flux_pro_1_1':
      case 'flux_dev':
      case 'flux_lora':
      case 'ideogram_v3':
      case 'imagen_3':
      case 'imagen_3_fast':
      case 'minimax_image':
        return { headerIcon: <ImageIcon size={16} />, inputs: [{ label: 'PROMPT', color: pink }], outputs: [{ label: 'IMAGE', color: blue }] };
      case 'ideogram_v3_edit':
        return { headerIcon: <Palette size={16} />, inputs: [{ label: 'PROMPT', color: pink }, { label: 'IMAGE', color: blue }], outputs: [{ label: 'IMAGE', color: blue }] };
      
      // Video models configurations
      case 'veo_2':
      case 'veo_3_1':
      case 'kling_2_6_pro':
      case 'kling_2_1_pro':
      case 'kling_2_0_master':
      case 'kling_1_6_pro':
      case 'kling_1_6_standard':
      case 'hunyuan_video_v1_5_t2v':
      case 'luma_ray_2':
      case 'luma_ray_2_flash':
      case 'pika_2_2':
      case 'ltx_video':
        return { headerIcon: <Film size={16} />, inputs: [{ label: 'PROMPT', color: pink }], outputs: [{ label: 'VIDEO', color: videoRed }] };
      
      case 'veo_2_i2v':
      case 'hunyuan_video_v1_5_i2v':
      case 'hunyuan_video_i2v':
      case 'minimax_hailuo':
      case 'minimax_director':
      case 'wan_i2v':
        return { headerIcon: <Video size={16} />, inputs: [{ label: 'IMAGE', color: blue }, { label: 'PROMPT', color: pink }], outputs: [{ label: 'VIDEO', color: videoRed }] };

      // Lip Sync configurations
      case 'kling_lipsync_a2v':
      case 'sync_lipsync_v1':
      case 'sync_lipsync_v2':
      case 'tavus_hummingbird':
      case 'latent_sync':
        return { headerIcon: <Waves size={16} />, inputs: [{ label: 'Video', color: videoRed }, { label: 'Audio', color: audioYellow }], outputs: [{ label: 'Result', color: videoRed }] };
      case 'kling_lipsync_t2v':
        return { headerIcon: <Type size={16} />, inputs: [{ label: 'Video', color: videoRed }, { label: 'Text', color: pink }], outputs: [{ label: 'Result', color: videoRed }] };

      case 'video_frame':
        return { headerIcon: <Video size={16} />, inputs: [{ label: 'Video', color: videoRed }], outputs: [{ label: 'Frame', color: teal }] };
      default:
        return { outputs: [{ label: 'OUT', color: '#94a3b8' }] };
    }
  };

  return (
    <BaseNode id={node.id} type={node.type} label={node.data.label} selected={selected} onDelete={onDelete} onMouseDown={onMouseDown} {...getPortConfig()}>
      {renderContent()}
    </BaseNode>
  );
};
