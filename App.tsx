
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { 
  Search, Clock, Briefcase, Image as ImageIcon, 
  Play, Box, Sparkles, HelpCircle, MessageSquare, 
  Share2, ChevronDown, MousePointer2, Hand, 
  RotateCcw, RotateCw, Plus, Trash2, X,
  FileUp, FileDown, File, Eye, Database, Layers, Palette, Crop, Maximize2, Droplets,
  RefreshCcw, Video, ListFilter, Type, Wand2, PlusCircle, Brain, Camera, FileVideo,
  Hash, ToggleRight, List, Dice5, Braces, Film, Zap, Clapperboard, 
  Smile, UserCircle, MessageCircle, Waves, Volume2, Mic2, Music, 
  Activity, BoxSelect, Maximize, Scissors, Binary, Calculator, Globe, MapPin, 
  Terminal, Timer, Palette as PaletteIcon, Bird, Radio, Info, Minus, ArrowRight,
  StickyNote, Group
} from 'lucide-react';
import { 
  ReactFlow,
  Node, 
  Edge as RFEdge, 
  Connection, 
  addEdge, 
  useNodesState, 
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
  SelectionMode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CanvasNode, Edge, ViewState, NodeType, SidebarItem } from './types';
import { generateAIContent, generateAIImage } from './services/geminiService';
import { apiService, Workflow, WorkflowFilters } from './services/apiService';
import { pollingManager } from './utils/pollingManager';
import { NodeRenderer } from './components/NodeRenderer';
import { RightPanel } from './components/RightPanel';
import { NodePicker } from './components/NodePicker';
import { ApiTestPage } from './components/ApiTestPage';
import WorkflowDashboard from './components/WorkflowDashboard';
import { NODE_PANEL_CONFIG } from './components/nodePanelConfig';
import { getPortConfigForNode, getEdgeStyleFromPort } from './utils/portUtils';
import { validatePortConnection, getDataTypeFromPort, findCompatibleInputPortIndex, DataType } from './utils/typeValidation';
import { debounce, DebouncedFunction } from './utils/debounce';

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

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'prompt_enhancer', label: 'Prompt Enhancer', icon: <Wand2 size={20} />, category: 'quick-access' },
  { id: 'prompt_concatenator', label: 'Prompt Combiner', icon: <PlusCircle size={20} />, category: 'quick-access' },
  { id: 'import', label: 'Import', icon: <FileUp size={20} />, category: 'quick-access' },
  { id: 'file', label: 'File', icon: <File size={20} />, category: 'quick-access' },
  { id: 'export', label: 'Export', icon: <FileDown size={20} />, category: 'quick-access' },
  { id: 'preview', label: 'Preview', icon: <Eye size={20} />, category: 'quick-access' },
  { id: 'sticky_note', label: 'Sticky Note', icon: <StickyNote size={20} />, category: 'quick-access' },
  { id: 'group', label: 'Group Frame', icon: <Box size={20} />, category: 'quick-access' },
  
  // Toolbox Categories
  { id: 'levels', label: 'Levels', icon: <Layers size={20} />, category: 'toolbox', subCategory: 'editing' },
  { id: 'compositor', label: 'Compositor', icon: <ImageIcon size={20} />, category: 'toolbox', subCategory: 'editing' },
  { id: 'painter', label: 'Painter', icon: <Palette size={20} />, category: 'toolbox', subCategory: 'editing' },
  { id: 'crop', label: 'Crop', icon: <Crop size={20} />, category: 'toolbox', subCategory: 'editing' },
  { id: 'blur', label: 'Blur', icon: <Droplets size={20} />, category: 'toolbox', subCategory: 'editing' },
  { id: 'invert', label: 'Invert', icon: <RefreshCcw size={20} />, category: 'toolbox', subCategory: 'editing' },
  { id: 'style_guide', label: 'Style Guide', icon: <PaletteIcon size={20} />, category: 'toolbox', subCategory: 'editing' },
  
  { id: 'any_llm', label: 'Advanced Prompt', icon: <Brain size={20} />, category: 'toolbox', subCategory: 'text' },
  { id: 'basic_call', label: 'Basic Prompt', icon: <Type size={20} />, category: 'toolbox', subCategory: 'text' },
  { id: 'image_describer', label: 'Image Describer', icon: <Camera size={20} />, category: 'toolbox', subCategory: 'text' },
  { id: 'text', label: 'Text', icon: <Type size={20} />, category: 'toolbox', subCategory: 'text' },
  
  { id: 'number', label: 'Number', icon: <Hash size={20} />, category: 'toolbox', subCategory: 'datatypes' },
  { id: 'toggle', label: 'Toggle', icon: <ToggleRight size={20} />, category: 'toolbox', subCategory: 'datatypes' },
  { id: 'list', label: 'Dropdown', icon: <List size={20} />, category: 'toolbox', subCategory: 'datatypes' },
  
  { id: 'array', label: 'Array', icon: <Braces size={20} />, category: 'toolbox', subCategory: 'functions' },
  { id: 'options', label: 'List', icon: <ListFilter size={20} />, category: 'toolbox', subCategory: 'functions' },

  // Image Models Category
  { id: 'nano_banana_pro', label: 'Nano Banana Pro', icon: <img src={GOOGLE_LOGO_URL} alt="Google" className="w-6 h-6 object-contain" />, category: 'image-models' },
  { id: 'nano_banana_pro_edit', label: 'Nano Banana Pro Edit', icon: <img src={GOOGLE_LOGO_URL} alt="Google" className="w-6 h-6 object-contain" />, category: 'image-models' },
  { id: 'flux_pro_1_1_ultra', label: 'Flux Pro 1.1 Ultra', icon: <img src={FLUX_LOGO_URL} alt="Flux" className="w-6 h-6 object-contain" />, category: 'image-models' },
  { id: 'flux_pro_1_1', label: 'Flux Pro 1.1', icon: <img src={FLUX_LOGO_URL} alt="Flux" className="w-6 h-6 object-contain" />, category: 'image-models' },
  { id: 'flux_dev', label: 'Flux Dev', icon: <img src={FLUX_LOGO_URL} alt="Flux" className="w-6 h-6 object-contain" />, category: 'image-models' },
  { id: 'flux_lora', label: 'Flux LoRA', icon: <img src={FLUX_LOGO_URL} alt="Flux" className="w-6 h-6 object-contain" />, category: 'image-models' },
  { id: 'ideogram_v3', label: 'Ideogram V3', icon: <img src={IDEOGRAM_LOGO_URL} alt="Ideogram" className="w-6 h-6 object-contain" />, category: 'image-models' },
  { id: 'ideogram_v3_edit', label: 'Ideogram V3 Edit', icon: <img src={IDEOGRAM_LOGO_URL} alt="Ideogram" className="w-6 h-6 object-contain" />, category: 'image-models' },
  { id: 'imagen_3', label: 'Imagen 3', icon: <img src={GOOGLE_LOGO_URL} alt="Google" className="w-6 h-6 object-contain" />, category: 'image-models' },
  { id: 'imagen_3_fast', label: 'Imagen 3 Fast', icon: <img src={GOOGLE_LOGO_URL} alt="Google" className="w-6 h-6 object-contain" />, category: 'image-models' },
  { id: 'minimax_image', label: 'Minimax Image', icon: <img src={MINIMAX_LOGO_URL} alt="Minimax" className="w-6 h-6 object-contain" />, category: 'image-models' },

  // Video Models Category
  { id: 'veo_2', label: 'Veo 2', icon: <img src={GOOGLE_LOGO_URL} alt="Google" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'veo_2_i2v', label: 'Veo 2 I2V', icon: <img src={GOOGLE_LOGO_URL} alt="Google" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'veo_3_1', label: 'Veo 3.1', icon: <img src={GOOGLE_LOGO_URL} alt="Google" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'kling_2_6_pro', label: 'Kling 2.6 Pro', icon: <img src={KLING_LOGO_URL} alt="Kling AI" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'kling_2_1_pro', label: 'Kling 2.1 Pro', icon: <img src={KLING_LOGO_URL} alt="Kling AI" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'kling_2_0_master', label: 'Kling 2.0 Master', icon: <img src={KLING_LOGO_URL} alt="Kling AI" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'kling_1_6_pro', label: 'Kling 1.6 Pro', icon: <img src={KLING_LOGO_URL} alt="Kling AI" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'kling_1_6_standard', label: 'Kling 1.6 Standard', icon: <img src={KLING_LOGO_URL} alt="Kling AI" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'hunyuan_video_v1_5_i2v', label: 'Hunyuan Video V1.5 I2V', icon: <img src={HUNYUAN_LOGO_URL} alt="Hunyuan" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'hunyuan_video_v1_5_t2v', label: 'Hunyuan Video V1.5 T2V', icon: <img src={HUNYUAN_LOGO_URL} alt="Hunyuan" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'hunyuan_video_i2v', label: 'Hunyuan Video I2V', icon: <img src={HUNYUAN_LOGO_URL} alt="Hunyuan" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'luma_ray_2', label: 'Luma Ray 2', icon: <img src={LUMA_LOGO_URL} alt="Luma AI" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'luma_ray_2_flash', label: 'Luma Ray 2 Flash', icon: <img src={LUMA_LOGO_URL} alt="Luma AI" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'minimax_hailuo', label: 'Minimax/Hailuo', icon: <img src={MINIMAX_LOGO_URL} alt="Minimax" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'minimax_director', label: 'Minimax Director', icon: <img src={MINIMAX_LOGO_URL} alt="Minimax" className="w-6 h-6 object-contain" />, category: 'video-models' },
  { id: 'pika_2_2', label: 'Pika 2.2', icon: <Film size={20} />, category: 'video-models' },
  { id: 'ltx_video', label: 'LTX Video', icon: <Play size={20} />, category: 'video-models' },
  { id: 'wan_i2v', label: 'Wan I2V', icon: <Video size={20} />, category: 'video-models' },

  // Lip Sync
  { id: 'kling_lipsync_a2v', label: 'Kling Lipsync A2V', icon: <img src={KLING_LOGO_URL} alt="Kling AI" className="w-6 h-6 object-contain" />, category: 'lip-sync' },
  { id: 'kling_lipsync_t2v', label: 'Kling Lipsync T2V', icon: <img src={KLING_LOGO_URL} alt="Kling AI" className="w-6 h-6 object-contain" />, category: 'lip-sync' },
  { id: 'sync_lipsync_v1', label: 'Sync Lipsync V1', icon: <Activity size={20} />, category: 'lip-sync' },
  { id: 'sync_lipsync_v2', label: 'Sync Lipsync V2', icon: <Waves size={20} />, category: 'lip-sync' },
  { id: 'tavus_hummingbird', label: 'Tavus Hummingbird', icon: <Bird size={20} />, category: 'lip-sync' },
  { id: 'latent_sync', label: 'LatentSync', icon: <Sparkles size={20} />, category: 'lip-sync' },

  // Upscaling & Enhancement
  { id: 'topaz_video', label: 'Topaz Video', icon: <Video size={20} />, category: 'upscaling' },
  { id: 'creative_upscaler', label: 'Creative Upscaler', icon: <Maximize2 size={20} />, category: 'upscaling' },
  { id: 'esrgan', label: 'ESRGAN', icon: <Sparkles size={20} />, category: 'upscaling' },
  { id: 'thera', label: 'Thera', icon: <Zap size={20} />, category: 'upscaling' },
  { id: 'drct', label: 'DRCT', icon: <Maximize size={20} />, category: 'upscaling' },

  // 3D Generation
  { id: 'trellis', label: 'Trellis', icon: <img src={TRELLIS_LOGO_URL} alt="Trellis" className="w-6 h-6 object-contain" />, category: '3d-gen' },
  { id: 'hunyuan_3d_v2', label: 'Hunyuan 3D V2', icon: <img src={HUNYUAN_LOGO_URL} alt="Hunyuan" className="w-6 h-6 object-contain" />, category: '3d-gen' },
  { id: 'hunyuan_3d_mini', label: 'Hunyuan 3D Mini', icon: <img src={HUNYUAN_LOGO_URL} alt="Hunyuan" className="w-6 h-6 object-contain" />, category: '3d-gen' },
  { id: 'hunyuan_3d_turbo', label: 'Hunyuan 3D Turbo', icon: <img src={HUNYUAN_LOGO_URL} alt="Hunyuan" className="w-6 h-6 object-contain" />, category: '3d-gen' },

  // Audio / TTS
  { id: 'minimax_speech_hd', label: 'Minimax Speech HD', icon: <img src={MINIMAX_LOGO_URL} alt="Minimax" className="w-6 h-6 object-contain" />, category: 'audio-tts' },
  { id: 'minimax_speech_turbo', label: 'Minimax Speech Turbo', icon: <img src={MINIMAX_LOGO_URL} alt="Minimax" className="w-6 h-6 object-contain" />, category: 'audio-tts' },
  { id: 'kokoro_tts', label: 'Kokoro TTS', icon: <Mic2 size={20} />, category: 'audio-tts' },
  { id: 'dia_tts', label: 'Dia TTS', icon: <Mic2 size={20} />, category: 'audio-tts' },
  { id: 'elevenlabs_tts', label: 'ElevenLabs TTS', icon: <img src={ELEVENLABS_LOGO_URL} alt="ElevenLabs" className="w-6 h-6 object-contain" />, category: 'audio-tts' },
  { id: 'elevenlabs_turbo', label: 'ElevenLabs Turbo', icon: <img src={ELEVENLABS_LOGO_URL} alt="ElevenLabs" className="w-6 h-6 object-contain" />, category: 'audio-tts' },
  { id: 'mmaudio_v2', label: 'MMAudio V2', icon: <img src={META_LOGO_URL} alt="Meta" className="w-6 h-6 object-contain" />, category: 'audio-tts' },

  // Utility
  { id: 'background_remove', label: 'Background Remove', icon: <Scissors size={20} />, category: 'utility' },
  { id: 'image_to_svg', label: 'Image to SVG', icon: <ImageIcon size={20} />, category: 'utility' },
  { id: 'speech_to_text', label: 'Speech to Text', icon: <Mic2 size={20} />, category: 'utility' },
  { id: 'whisper', label: 'Whisper', icon: <Mic2 size={20} />, category: 'utility' },
];

const SidebarCategory: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h3 className="mb-4 px-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{title}</h3>
      {children}
    </div>
  );
};

const SidebarDraggableItem: React.FC<{ item: SidebarItem, onDragStart: (e: React.DragEvent, type: NodeType) => void }> = ({ item, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => {
        onDragStart(e, item.id);
      }}
      className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-white/5 bg-[#1a1b1e] p-3 transition-all hover:bg-white/5 hover:border-white/10 cursor-grab active:cursor-grabbing"
    >
      <div className="text-gray-500 group-hover:text-white transition-colors">{item.icon}</div>
      <span className="text-xs text-center font-medium text-gray-500 group-hover:text-gray-300 transition-colors leading-tight">
        {item.label}
      </span>
    </div>
  );
};

const ToolbarButton: React.FC<{ icon: React.ReactNode, active: boolean, onClick?: () => void, activeColor?: string }> = ({ icon, active, onClick, activeColor = 'bg-white/10' }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${active ? `${activeColor} text-black` : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
    >
      {icon}
    </button>
  );
};

  // Convert CanvasNode to React Flow Node format
  const convertToRFNode = (node: CanvasNode): Node => {
    // Ensure all required ReactFlow properties are present
    return {
      id: node.id,
      type: node.type || 'text', // Use 'text' as fallback (valid NodeType)
      position: {
        x: node.position?.x ?? 0,
        y: node.position?.y ?? 0
      },
      data: node.data || {},
      selected: false,
      draggable: true,
      selectable: true,
      connectable: true,
      // Map parent properties
      parentId: node.data.parentId,
      extent: node.data.extent,
      width: node.data.width,
      height: node.data.height,
      style: node.type === 'group' ? { width: node.data.width, height: node.data.height } : undefined,
    };
  };

  // Convert React Flow Node back to CanvasNode format
  const convertFromRFNode = (node: Node | undefined): CanvasNode | null => {
    if (!node || !node.id) return null;
    
    // Ensure position is valid
    const position = node.position && typeof node.position.x === 'number' && typeof node.position.y === 'number'
      ? node.position
      : { x: 0, y: 0 };
    
    // Ensure type is valid - ReactFlow uses 'default' as fallback, but we need a valid NodeType
    // If type is missing or 'default', we'll use a fallback that exists in our NodeType union
    const nodeType = node.type || 'text'; // Use 'text' as a safe default since it's always available
    const type = nodeType as NodeType;
    
    // Ensure data is an object
    const data = node.data && typeof node.data === 'object' 
      ? node.data as CanvasNode['data']
      : { label: '', content: '', status: 'idle' as const };
    
    return {
      id: node.id,
      type,
      position,
      data: {
        ...data,
        parentId: node.parentId,
        extent: node.extent as 'parent' | undefined,
        width: node.width || undefined,
        height: node.height || undefined,
      }
    };
  };

// Convert Edge to React Flow Edge format
const convertToRFEdge = (edge: Edge, nodes: CanvasNode[]): RFEdge => {
  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);
  
  if (!sourceNode || !targetNode) {
    throw new Error('Invalid edge: source or target node not found');
  }
  
  const sourcePortIndex = edge.sourcePortIndex ?? 0;
  const targetPortIndex = edge.targetPortIndex ?? 0;
  
  // Get edge style based on source port color
  const edgeStyle = getEdgeStyleFromPort(sourceNode.type, sourcePortIndex);
  
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: `output-${sourcePortIndex}`,
    targetHandle: `input-${targetPortIndex}`,
    type: 'default',
    style: edgeStyle
  };
};

// Convert React Flow Edge back to Edge format
const convertFromRFEdge = (edge: RFEdge): Edge => {
  const sourcePortIndex = edge.sourceHandle ? parseInt(edge.sourceHandle.split('-')[1] || '0') : 0;
  const targetPortIndex = edge.targetHandle ? parseInt(edge.targetHandle.split('-')[1] || '0') : 0;
  
  return {
    id: edge.id,
    source: edge.source,
    sourcePortIndex,
    target: edge.target,
    targetPortIndex
  };
};

// Custom node component wrapper
// Create a context to share flow functions
const FlowContext = React.createContext<{
  onRunNode: (id: string) => Promise<void>;
  onUpdateNode: (id: string, data: any) => void;
} | null>(null);

interface FlowCanvasProps {
  initialNodes?: CanvasNode[];
  initialEdges?: Edge[];
  initialViewport?: ViewState;
  workflowId?: string; // Add workflowId prop
  onNodePickerOpen: (position: { x: number; y: number; sourceOutputType?: DataType; sourcePortIndex?: number; sourceNodeId?: string }) => void;
  onSelectedNodeChange: (nodeId: string | null) => void;
  onSelectedNodeDataChange?: (node: CanvasNode | null) => void;
  onNodeUpdateHandlerReady?: (handler: (nodeId: string, data: any) => void) => void;
  onNodeRunHandlerReady?: (handler: (nodeId: string, runs: number, prompt?: string) => void) => void;
  onDeselectNodesReady?: (handler: () => void) => void;
  onEdgesAndNodesReady?: (edges: Edge[], nodes: CanvasNode[]) => void;
  onViewportChange?: (viewport: ViewState) => void;
  onGroupNodesReady?: (handler: () => void) => void;
  onMultiSelectionChange?: (selectedIds: string[]) => void;
  cursorMode?: 'pointer' | 'hand';
}

function FlowCanvas({ initialNodes, initialEdges, initialViewport, onNodePickerOpen, onSelectedNodeChange, onSelectedNodeDataChange, onNodeUpdateHandlerReady, onNodeRunHandlerReady, onDeselectNodesReady, onEdgesAndNodesReady, onViewportChange, onGroupNodesReady, onMultiSelectionChange, workflowId, cursorMode = 'pointer' }: FlowCanvasProps) {
  // Track previous initial values to detect actual changes
  const prevInitialNodesRef = useRef<CanvasNode[] | undefined>(undefined);
  const prevInitialEdgesRef = useRef<Edge[] | undefined>(undefined);
  const viewportInitializedRef = useRef(false);
  
  // Initialize nodes/edges from props ONCE
  const initialRFNodes = useMemo(() => 
    (initialNodes || []).map(convertToRFNode), 
    [] // Only calculate once on mount
  );
  const initialRFEdges = useMemo(() => 
    (initialEdges || []).map(e => convertToRFEdge(e, initialNodes || [])), 
    [] // Only calculate once on mount
  );
  
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<Node>(initialRFNodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState<RFEdge>(initialRFEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const { screenToFlowPosition, getViewport, setViewport: setRFViewport, getNodes } = useReactFlow();
  
  // Only update nodes/edges when initial data ACTUALLY changes (different workflow loaded)
  useEffect(() => {
    // Check if nodes actually changed by comparing IDs
    const nodesChanged = prevInitialNodesRef.current !== initialNodes && 
      initialNodes &&
      (prevInitialNodesRef.current?.length !== initialNodes.length ||
       prevInitialNodesRef.current?.some((n, i) => n.id !== initialNodes[i]?.id) ||
       !prevInitialNodesRef.current);
    
    if (nodesChanged) {
      const newNodes = initialNodes.map(convertToRFNode);
      setRfNodes(newNodes);
      prevInitialNodesRef.current = initialNodes;
    }
  }, [initialNodes, setRfNodes]);
  
  useEffect(() => {
    // Check if edges actually changed
    const edgesChanged = prevInitialEdgesRef.current !== initialEdges &&
      initialEdges &&
      (prevInitialEdgesRef.current?.length !== initialEdges.length ||
       prevInitialEdgesRef.current?.some((e, i) => e.id !== initialEdges[i]?.id) ||
       !prevInitialEdgesRef.current);
    
    if (edgesChanged && initialNodes) {
      const newEdges = initialEdges.map(e => convertToRFEdge(e, initialNodes));
      setRfEdges(newEdges);
      prevInitialEdgesRef.current = initialEdges;
    }
  }, [initialEdges, initialNodes, setRfEdges]);
  
  // Set initial viewport only once
  useEffect(() => {
    if (initialViewport && !viewportInitializedRef.current) {
      setRFViewport({ x: initialViewport.x, y: initialViewport.y, zoom: initialViewport.zoom });
      viewportInitializedRef.current = true;
    }
  }, [initialViewport, setRFViewport]);
  
  // Track viewport changes (debounced to avoid excessive updates)
  useEffect(() => {
    const timer = setTimeout(() => {
      const viewport = getViewport();
      if (onViewportChange) {
        onViewportChange({ x: viewport.x, y: viewport.y, zoom: viewport.zoom });
      }
    }, 200); // Debounce viewport updates
    
    return () => clearTimeout(timer);
  }, [getViewport, onViewportChange]);
  
  // Convert RF nodes/edges to CanvasNode/Edge for compatibility
  const nodes = useMemo(() => {
    const converted = rfNodes.map(convertFromRFNode).filter((n): n is CanvasNode => n !== null);
    return converted;
  }, [rfNodes, selectedNodeId]);
  const edges = useMemo(() => rfEdges.map(convertFromRFEdge), [rfEdges]);

  const deleteNode = useCallback((id: string) => {
    setRfNodes((nds) => nds.filter((n) => n.id !== id));
    setRfEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  }, [selectedNodeId, setRfNodes, setRfEdges]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTyping = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);
      if (isTyping) return;
      
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        deleteNode(selectedNodeId);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, deleteNode]);
  
  useEffect(() => {
    return () => {
      pollingManager.stopAllPolling();
    };
  }, []);
  
  const addNode = useCallback((type: NodeType, x?: number, y?: number): string => {
    const viewport = getViewport();
    const finalX = x ?? (window.innerWidth / 2 - viewport.x - 140) / viewport.zoom;
    const finalY = y ?? (window.innerHeight / 2 - viewport.y - 100) / viewport.zoom;

    const sidebarItem = SIDEBAR_ITEMS.find(item => item.id === type);
    const label = sidebarItem?.label || type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: type || 'default',
      position: { 
        x: typeof finalX === 'number' ? finalX : 0, 
        y: typeof finalY === 'number' ? finalY : 0 
      },
      data: { 
        label: type === 'sticky_note' ? 'Sticky Note' : (label || 'Untitled Node'),
        content: '',
        status: 'idle',
        ...(type === 'sticky_note' && { noteColor: 'yellow', noteWidth: 240, noteHeight: 200 }),
        ...(type === 'group' && { width: 400, height: 300, label: 'Group Frame' })
      },
      selected: false,
      draggable: true,
      selectable: true,
      connectable: type !== 'sticky_note', // Sticky notes don't connect to other nodes
      style: type === 'group' ? { width: 400, height: 300, zIndex: -1 } : undefined,
      width: type === 'group' ? 400 : undefined,
      height: type === 'group' ? 300 : undefined,
    };

    setRfNodes((nds) => {
      const newNodes = [...nds, newNode];
      return newNodes;
    });
    setSelectedNodeId(newNode.id);
    return newNode.id;
  }, [setRfNodes, getViewport]);
  
  const handleUpdateNode = useCallback((id: string, data: any) => {
    // Guard against undefined data
    if (data === undefined || data === null) {
      return;
    }

    setRfNodes((nds) => {
      const updated = nds.map((n) => {
        if (n.id === id) {
          const updatedNode = (() => {
            if (data.panelSettings && n.data.panelSettings) {
              const merged = {
                ...n,
                data: {
                  ...n.data,
                  ...data,
                  panelSettings: {
                    ...n.data.panelSettings,
                    ...data.panelSettings
                  }
                }
              };
              return merged;
            }
            const simple = { ...n, data: { ...n.data, ...data } };
            return simple;
          })();

          return updatedNode;
        }
        return n;
      });

      return updated;
    });
  }, [setRfNodes]);
  
  const onDragStart = (e: React.DragEvent, type: NodeType) => {
    // Set data in multiple formats for better compatibility
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.setData('text/plain', type); // Fallback for some browsers
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Try to get the node type from dataTransfer
    const type = e.dataTransfer.getData('nodeType') ||
                 e.dataTransfer.getData('application/reactflow') ||
                 e.dataTransfer.getData('text/plain');

    if (!type) {
      return;
    }

    // Get the drop position relative to the flow
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });

    // Add the node at the drop position (offset to center the node)
    const finalPosition = { x: position.x - 140, y: position.y - 50 };
    addNode(type as NodeType, finalPosition.x, finalPosition.y);
  }, [addNode, screenToFlowPosition]);
  
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only allow drop if we have the correct data
    const hasNodeType = e.dataTransfer.types.includes('nodeType') ||
                       e.dataTransfer.types.includes('application/reactflow') ||
                       e.dataTransfer.types.includes('text/plain');

    if (hasNodeType) {
      e.dataTransfer.dropEffect = 'move';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  }, []);
  
  const onConnect: OnConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target || !params.sourceHandle || !params.targetHandle) {
      return;
    }
    
    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);
    
    if (!sourceNode || !targetNode) return;
    
    const sourcePortIndex = parseInt(params.sourceHandle.split('-')[1] || '0');
    const targetPortIndex = parseInt(params.targetHandle.split('-')[1] || '0');
    
    // Get port configs - need to handle dynamic ports for prompt_concatenator
    const sourceConfig = getPortConfigForNode(sourceNode.type);
    let targetConfig = getPortConfigForNode(targetNode.type);
    
    // Handle dynamic ports for prompt_concatenator
    if (targetNode.type === 'prompt_concatenator') {
      const textInputPortCount = targetNode.data.panelSettings?.textInputPortCount || 0;
      const pink = '#c084fc';
      const inputs = [
        { label: 'PROMPT', color: pink },
        { label: 'PROMPT', color: pink }
      ];
      
      // Add dynamic TEXT input ports
      for (let i = 0; i < textInputPortCount; i++) {
        inputs.push({ label: 'TEXT', color: pink });
      }
      
      targetConfig = { ...targetConfig, inputs };
    }

    // Handle dynamic ports for style_guide
    if (targetNode.type === 'style_guide') {
      const layerCount = targetNode.data.panelSettings?.layerCount ?? 4;
      const blue = '#38bdf8';
      const inputs = [];

      // Add Background Input (Port 0)
      inputs.push({ label: 'Background', color: blue, dataType: 'image' as const });

      // Add Layer Inputs (Ports 1 to layerCount)
      for (let i = 1; i <= layerCount; i++) {
        inputs.push({ label: `Layer ${i}`, color: blue, dataType: 'image' as const });
      }
      
      targetConfig = { ...targetConfig, inputs };
    }
    
    const outputPort = sourceConfig.outputs[sourcePortIndex];
    const inputPortConfig = targetConfig.inputs[targetPortIndex];
    
    if (!outputPort || !inputPortConfig) return;
    
    const validation = validatePortConnection(outputPort, inputPortConfig);
    
    if (validation.isValid) {
      setRfEdges((eds) => addEdge(params, eds));
    }
  }, [nodes, setRfEdges]);
  
  const [connectingFrom, setConnectingFrom] = useState<{ nodeId: string; portIndex: number; outputType?: DataType } | null>(null);
  
  const onConnectStart = useCallback((event: any, { nodeId, handleId }: { nodeId: string | null, handleId: string | null }) => {
    if (!nodeId || !handleId) return;
    
    const sourceNode = nodes.find(n => n.id === nodeId);
    if (!sourceNode) return;
    
    const sourcePortIndex = parseInt(handleId.split('-')[1] || '0');
    const sourceConfig = getPortConfigForNode(sourceNode.type);
    const outputPort = sourceConfig.outputs[sourcePortIndex];
    
    if (outputPort) {
      const sourceOutputType = getDataTypeFromPort(outputPort);
      setConnectingFrom({ nodeId, portIndex: sourcePortIndex, outputType: sourceOutputType });
    }
  }, [nodes]);
  
  const onConnectEnd = useCallback((event: MouseEvent | TouchEvent) => {
    const target = event.target as HTMLElement;
    const isHandle = target.classList.contains('react-flow__handle');
    
    if (!isHandle && connectingFrom) {
      // Show node picker
      const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX;
      const clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY;
      
      onNodePickerOpen({
        x: clientX,
        y: clientY,
        sourceOutputType: connectingFrom.outputType,
        sourcePortIndex: connectingFrom.portIndex,
        sourceNodeId: connectingFrom.nodeId
      });
      
      setConnectingFrom(null);
    } else {
      setConnectingFrom(null);
    }
  }, [connectingFrom, onNodePickerOpen]);
  
  
  const isGenerativeModelNode = (nodeType: NodeType): boolean => {
    const generativeModelTypes: NodeType[] = [
      // Image Models
      'nano_banana_pro', 'nano_banana_pro_edit', 'flux_pro_1_1_ultra', 'flux_pro_1_1',
      'flux_dev', 'flux_lora', 'ideogram_v3', 'ideogram_v3_edit',
      'imagen_3', 'imagen_3_fast', 'minimax_image',
      // Video Models
      'veo_2', 'veo_2_i2v', 'veo_3_1',
      'kling_2_6_pro', 'kling_2_1_pro', 'kling_2_0_master', 'kling_1_6_pro', 'kling_1_6_standard',
      'hunyuan_video_v1_5_i2v', 'hunyuan_video_v1_5_t2v', 'hunyuan_video_i2v',
      'luma_ray_2', 'luma_ray_2_flash',
      'minimax_hailuo', 'minimax_director',
      'pika_2_2', 'ltx_video', 'wan_i2v'
    ];
    return generativeModelTypes.includes(nodeType);
  };

  // Keep alias for backwards compatibility
  const isImageModelNode = isGenerativeModelNode;
  
  const runAINode = useCallback(async (id: string, promptOverride?: string) => {
    console.log('[App] runAINode called for:', id, promptOverride);
    const node = nodes.find(n => n.id === id);
    if (!node) {
      console.error('[App] Node not found:', id);
      return;
    }
    console.log('[App] Node found:', node.type, node.data);
    
    if (node.data.status === 'loading') {
      console.log('[App] Node is already loading, skipping');
      return;
    }

    handleUpdateNode(id, { status: 'loading' });
    
    try {
      if (node.type === 'prompt_enhancer' || node.type === 'any_llm' || node.type === 'image_describer' || node.type === 'video_describer') {
        const text = await generateAIContent(node.data.content || '');
        handleUpdateNode(id, { content: text, status: 'success' });
      } else if (node.type === 'image') {
        const url = await generateAIImage(node.data.content || 'A beautiful futuristic landscape');
        handleUpdateNode(id, { imageUrl: url, status: 'success' });
      } else if (isImageModelNode(node.type)) {
        console.log('[App] Processing Image Model Node:', node.type);
        const inputImageUrls: string[] = [];
        const inputEdges = edges.filter(e => e.target === id);

        // ALWAYS get the prompt from the most current source
        // Priority: 1) promptOverride (from RightPanel), 2) panelSettings.prompt, 3) node.data.content, 4) connected nodes
        let promptText = '';

        if (promptOverride !== undefined) {
          // Explicit prompt from RightPanel - use it
          promptText = String(promptOverride).trim();
        } else if (node.data.panelSettings?.prompt) {
          // Use saved prompt from panelSettings
          promptText = String(node.data.panelSettings.prompt).trim();
        } else if (node.data.content) {
          // Fallback to node content
          promptText = String(node.data.content).trim();
        }

        // Video I2V models have IMAGE at port 0, PROMPT at port 1
        const videoI2VModels = [
          'veo_2_i2v',
          'kling_2_6_pro', 'kling_2_1_pro', 'kling_2_0_master', 'kling_1_6_pro', 'kling_1_6_standard',
          'hunyuan_video_v1_5_i2v', 'hunyuan_video_i2v',
          'wan_i2v', 'pika_2_2', 'minimax_hailuo', 'minimax_director'
        ];
        const isVideoI2V = videoI2VModels.includes(node.type);

        // Collect images from connected nodes
        for (const edge of inputEdges) {
          const sourceNode = nodes.find((n: typeof nodes[0]) => n.id === edge.source);

          if (isVideoI2V) {
            // For video I2V: port 0 = IMAGE, port 1 = PROMPT
            if (edge.targetPortIndex === 0 && sourceNode?.data.imageUrl) {
              inputImageUrls.push(sourceNode.data.imageUrl);
            }
            if (edge.targetPortIndex === 1 && sourceNode?.data.content && !promptText) {
              promptText = String(sourceNode.data.content).trim();
            }
          } else if (node.type === 'nano_banana_pro' || node.type === 'nano_banana_pro_edit') {
            // For nano_banana: port 0 = PROMPT, port 1+ = IMAGE
            if (edge.targetPortIndex === 0 && sourceNode?.data.content && !promptText) {
              promptText = String(sourceNode.data.content).trim();
            }
            if (edge.targetPortIndex > 0 && sourceNode?.data.imageUrl) {
              inputImageUrls.push(sourceNode.data.imageUrl);
            }
          } else {
            // For other models: port 0 = PROMPT, collect any images
            if (edge.targetPortIndex === 0 && sourceNode?.data.content && !promptText) {
              promptText = String(sourceNode.data.content).trim();
            }
            if (sourceNode?.data.imageUrl) {
              inputImageUrls.push(sourceNode.data.imageUrl);
            }
          }
        }

        // Final validation - ensure we have a prompt (even if empty)
        if (!promptText) {
          promptText = '';
        }

        const request = {
          nodeId: id,
          nodeType: node.type,
          prompt: promptText, // ALWAYS pass prompt, even if empty
          panelSettings: node.data.panelSettings || {},
          inputImages: inputImageUrls
        };

        const { jobId, usedModel } = await apiService.startImageGeneration(request);
        handleUpdateNode(id, { jobId, usedModel });
        
        pollingManager.startPolling({
          jobId,
          nodeId: id,
          nodeType: node.type,
          usedModel,
          interval: 2500,
          onUpdate: (status) => {
            handleUpdateNode(id, {
              progress: status.progress,
              status: status.status === 'processing' ? 'loading' as const : undefined
            });
          },
          onComplete: (status) => {
            const updateData: any = {
              status: 'success' as const,
              progress: undefined
            };

            // Handle image, video, and audio results
            if (status.result?.imageUrl) {
              updateData.imageUrl = status.result.imageUrl;
            }
            if (status.result?.videoUrl) {
              updateData.videoUrl = status.result.videoUrl;
            }
            if (status.result?.audioUrl) {
              updateData.audioUrl = status.result.audioUrl;
            }

            handleUpdateNode(id, updateData);
          },
          onError: (error) => {
            handleUpdateNode(id, { status: 'error' as const });
          }
        });
      }
    } catch (err) {
      handleUpdateNode(id, { status: 'error' });
    }
  }, [nodes, edges, handleUpdateNode]);
  
  const handleRunSelectedNodes = useCallback(async (nodeId: string, runs: number, prompt?: string) => {
    for (let i = 0; i < runs; i++) {
      await runAINode(nodeId, prompt);
      if (i < runs - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }, [runAINode]);

  const handleGroupNodes = useCallback(() => {
    // Use getNodes() to avoid dependency on rfNodes state
    const currentNodes = getNodes();
    const selectedNodes = currentNodes.filter(n => n.selected && n.type !== 'group'); 
    if (selectedNodes.length < 1) return;

    // Calculate bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    selectedNodes.forEach(node => {
      const x = node.position.x;
      const y = node.position.y;
      // Try to get dimensions from measured dimensions (if rendered) or fallback
      const w = node.measured?.width || node.width || 340; 
      const h = node.measured?.height || node.height || 300;
      
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    });

    const padding = 60;
    const groupX = minX - padding;
    const groupY = minY - padding;
    const groupWidth = (maxX - minX) + (padding * 2);
    const groupHeight = (maxY - minY) + (padding * 2);

    const groupId = `group-${Date.now()}`;
    const groupNode: Node = {
      id: groupId,
      type: 'group',
      position: { x: groupX, y: groupY },
      data: { 
        label: 'Style Guide Maker',
        width: groupWidth,
        height: groupHeight
      },
      style: { width: groupWidth, height: groupHeight, zIndex: -1 },
      width: groupWidth,
      height: groupHeight,
      selected: true,
    };

    // Simply add the group node (Backdrop) without modifying children
    // This avoids complex parenting logic and ensures nodes stay in place
    setRfNodes(nodes => {
      // Add group node first so it renders behind (though zIndex handles this too)
      return [groupNode, ...nodes.map(n => ({ ...n, selected: false }))];
    });
    
    setSelectedNodeId(groupId);
  }, [getNodes, setRfNodes]);

  // Expose group nodes handler
  useEffect(() => {
    if (onGroupNodesReady) {
      onGroupNodesReady(handleGroupNodes);
    }
  }, [handleGroupNodes, onGroupNodesReady]);

  // Track multi-selection changes with comparison to prevent infinite loops
  const prevSelectedIdsRef = useRef<string[]>([]);
  useEffect(() => {
    const selectedNodes = rfNodes.filter(n => n.selected && n.type !== 'group');
    const selectedIds = selectedNodes.map(n => n.id).sort();
    
    // Check if selection actually changed
    const prevIds = prevSelectedIdsRef.current;
    const hasChanged = selectedIds.length !== prevIds.length || 
                      !selectedIds.every((id, i) => id === prevIds[i]);
    
    if (hasChanged) {
      prevSelectedIdsRef.current = selectedIds;
      if (onMultiSelectionChange) {
        onMultiSelectionChange(selectedIds);
      }
    }
  }, [rfNodes, onMultiSelectionChange]);
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;
  const shouldShowRightPanel = selectedNode && NODE_PANEL_CONFIG[selectedNode.type] && NODE_PANEL_CONFIG[selectedNode.type]!.length > 0;
  
  // Update node selection when React Flow selection changes
  useEffect(() => {
    const selectedNodes = rfNodes.filter(n => n.selected);
    if (selectedNodes.length > 0) {
      const newSelectedId = selectedNodes[0].id;
      setSelectedNodeId(newSelectedId);
      onSelectedNodeChange(newSelectedId);
      
      // Convert and pass the full node data - use setTimeout to avoid render-time updates
      const canvasNode = convertFromRFNode(selectedNodes[0]);
      if (canvasNode && onSelectedNodeDataChange) {
        // Defer the state update to avoid React render error
        setTimeout(() => {
          onSelectedNodeDataChange(canvasNode);
        }, 0);
      }
    } else {
      setSelectedNodeId(null);
      onSelectedNodeChange(null);
      if (onSelectedNodeDataChange) {
        setTimeout(() => {
          onSelectedNodeDataChange(null);
        }, 0);
      }
    }
  }, [rfNodes, onSelectedNodeChange, onSelectedNodeDataChange]);
  
  // Expose handlers to parent component via callbacks
  useEffect(() => {
    if (onNodeUpdateHandlerReady) {
      onNodeUpdateHandlerReady(handleUpdateNode);
    }
  }, [handleUpdateNode, onNodeUpdateHandlerReady]);
  
  useEffect(() => {
    if (onNodeRunHandlerReady) {
      onNodeRunHandlerReady(handleRunSelectedNodes);
    }
  }, [handleRunSelectedNodes, onNodeRunHandlerReady]);
  
  const deselectAllNodes = useCallback(() => {
    setRfNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
  }, [setRfNodes]);
  
  useEffect(() => {
    if (onDeselectNodesReady) {
      onDeselectNodesReady(deselectAllNodes);
    }
  }, [deselectAllNodes, onDeselectNodesReady]);
  
  // Expose edges and nodes to parent component (only when they actually change)
  const prevNodesRef = useRef<CanvasNode[]>([]);
  const prevEdgesRef = useRef<Edge[]>([]);
  
  useEffect(() => {
    // Compare node data including imageUrl, content, and other important fields to detect all changes
    const nodesChanged = JSON.stringify(prevNodesRef.current.map(n => ({ 
      id: n.id, 
      type: n.type,
      imageUrl: n.data.imageUrl,
      content: n.data.content,
      status: n.data.status,
      label: n.data.label
    }))) !== JSON.stringify(nodes.map(n => ({ 
      id: n.id, 
      type: n.type,
      imageUrl: n.data.imageUrl,
      content: n.data.content,
      status: n.data.status,
      label: n.data.label
    })));
    
    const edgesChanged = JSON.stringify(prevEdgesRef.current.map(e => ({ id: e.id, source: e.source, target: e.target }))) !== 
                        JSON.stringify(edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
    
    if ((nodesChanged || edgesChanged) && onEdgesAndNodesReady) {
      console.log('🔄 [FlowCanvas] Nodes/edges changed, calling onEdgesAndNodesReady');
      if (nodesChanged) {
        // Log which nodes have imageUrl
        nodes.forEach(node => {
          if (node.data.imageUrl) {
            const preview = node.data.imageUrl.startsWith('http') 
              ? node.data.imageUrl.substring(0, 50) + '...'
              : 'base64 or other format';
            console.log(`  📸 [FlowCanvas] Node ${node.id} (${node.type}) has imageUrl: ${preview}`);
          }
        });
      }
      prevNodesRef.current = nodes;
      prevEdgesRef.current = edges;
      onEdgesAndNodesReady(edges, nodes);
    }
  }, [edges, nodes, onEdgesAndNodesReady]);
  
  // Custom node component wrapper - defined inside FlowCanvas to access workflowId
  const CustomNodeWrapper: React.FC<{
    id: string;
    type: string;
    data: any;
    selected?: boolean;
    position: { x: number; y: number };
  }> = ({ id, type, data, selected, position }) => {
    // Reconstruct the Node object for conversion
    const node: Node = {
      id,
      type: type as NodeType,
      position,
      data,
      selected: selected || false
    };
    
    const canvasNode = convertFromRFNode(node);
    if (!canvasNode) {
      return null;
    }
    
    const { setNodes, getNodes, getEdges } = useReactFlow();
    const flowContext = React.useContext(FlowContext);
    
    const handleUpdate = (nodeId: string, updateData: any) => {
      setNodes((nds) => nds.map((n) => {
        if (n.id === nodeId) {
          if (updateData.panelSettings && n.data.panelSettings) {
            return {
              ...n,
              data: {
                ...n.data,
                ...updateData,
                panelSettings: {
                  ...n.data.panelSettings,
                  ...updateData.panelSettings
                }
              }
            };
          }
          return { ...n, data: { ...n.data, ...updateData } };
        }
        return n;
      }));
      flowContext?.onUpdateNode(nodeId, updateData);
    };
    
    const handleDelete = (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    };
    
    const handleRun = async (nodeId: string) => {
      if (flowContext) {
        await flowContext.onRunNode(nodeId);
      }
    };
    
    return (
      <NodeRenderer
        node={canvasNode}
        selected={selected || false}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onRun={handleRun}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        edges={getEdges().map(convertFromRFEdge).filter(Boolean)}
        nodes={getNodes().map(convertFromRFNode).filter((n): n is CanvasNode => n !== null)}
        workflowId={workflowId}
      />
    );
  };

  // Node types for React Flow - memoized to prevent recreation on every render
  const nodeTypes: NodeTypes = useMemo(() => ({
    default: CustomNodeWrapper,
    // Add all node types
    any_llm: CustomNodeWrapper,
    basic_call: CustomNodeWrapper,
    image_describer: CustomNodeWrapper,
    video_describer: CustomNodeWrapper,
    prompt_enhancer: CustomNodeWrapper,
    prompt_concatenator: CustomNodeWrapper,
    image: CustomNodeWrapper,
    text: CustomNodeWrapper,
    import: CustomNodeWrapper,
    file: CustomNodeWrapper,
    export: CustomNodeWrapper,
    preview: CustomNodeWrapper,
    levels: CustomNodeWrapper,
    compositor: CustomNodeWrapper,
    painter: CustomNodeWrapper,
    crop: CustomNodeWrapper,
    blur: CustomNodeWrapper,
    invert: CustomNodeWrapper,
    channels: CustomNodeWrapper,
    video_frame: CustomNodeWrapper,
    number: CustomNodeWrapper,
    toggle: CustomNodeWrapper,
    list: CustomNodeWrapper,
    seed: CustomNodeWrapper,
    array: CustomNodeWrapper,
    options: CustomNodeWrapper,
    nano_banana_pro: CustomNodeWrapper,
    nano_banana_pro_edit: CustomNodeWrapper,
    flux_pro_1_1_ultra: CustomNodeWrapper,
    flux_pro_1_1: CustomNodeWrapper,
    flux_dev: CustomNodeWrapper,
    flux_lora: CustomNodeWrapper,
    ideogram_v3: CustomNodeWrapper,
    ideogram_v3_edit: CustomNodeWrapper,
    imagen_3: CustomNodeWrapper,
    imagen_3_fast: CustomNodeWrapper,
    minimax_image: CustomNodeWrapper,
    veo_2: CustomNodeWrapper,
    veo_2_i2v: CustomNodeWrapper,
    veo_3_1: CustomNodeWrapper,
    kling_2_6_pro: CustomNodeWrapper,
    kling_2_1_pro: CustomNodeWrapper,
    kling_2_0_master: CustomNodeWrapper,
    kling_1_6_pro: CustomNodeWrapper,
    kling_1_6_standard: CustomNodeWrapper,
    hunyuan_video_v1_5_i2v: CustomNodeWrapper,
    hunyuan_video_v1_5_t2v: CustomNodeWrapper,
    hunyuan_video_i2v: CustomNodeWrapper,
    luma_ray_2: CustomNodeWrapper,
    luma_ray_2_flash: CustomNodeWrapper,
    minimax_hailuo: CustomNodeWrapper,
    minimax_director: CustomNodeWrapper,
    pika_2_2: CustomNodeWrapper,
    ltx_video: CustomNodeWrapper,
    wan_i2v: CustomNodeWrapper,
    kling_lipsync_a2v: CustomNodeWrapper,
    kling_lipsync_t2v: CustomNodeWrapper,
    sync_lipsync_v1: CustomNodeWrapper,
    sync_lipsync_v2: CustomNodeWrapper,
    tavus_hummingbird: CustomNodeWrapper,
    latent_sync: CustomNodeWrapper,
    topaz_video: CustomNodeWrapper,
    creative_upscaler: CustomNodeWrapper,
    esrgan: CustomNodeWrapper,
    thera: CustomNodeWrapper,
    drct: CustomNodeWrapper,
    trellis: CustomNodeWrapper,
    hunyuan_3d_v2: CustomNodeWrapper,
    hunyuan_3d_mini: CustomNodeWrapper,
    hunyuan_3d_turbo: CustomNodeWrapper,
    minimax_speech_hd: CustomNodeWrapper,
    minimax_speech_turbo: CustomNodeWrapper,
    kokoro_tts: CustomNodeWrapper,
    dia_tts: CustomNodeWrapper,
    elevenlabs_tts: CustomNodeWrapper,
    elevenlabs_turbo: CustomNodeWrapper,
    mmaudio_v2: CustomNodeWrapper,
    background_remove: CustomNodeWrapper,
    image_to_svg: CustomNodeWrapper,
    speech_to_text: CustomNodeWrapper,
    whisper: CustomNodeWrapper,
    sad_talker: CustomNodeWrapper,
    sticky_note: CustomNodeWrapper,
    style_guide: CustomNodeWrapper,
    group: CustomNodeWrapper,
  }), [workflowId]); // Recreate when workflowId changes
  
  return (
    <FlowContext.Provider value={{ onRunNode: runAINode, onUpdateNode: handleUpdateNode }}>
      <div 
        className="relative h-full w-full"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{ type: 'default' }}
          connectionLineType="default"
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          deleteKeyCode={['Delete', 'Backspace']}
          className="bg-[#050506]"
          panOnDrag={cursorMode === 'hand'}
          selectionOnDrag={cursorMode === 'pointer'}
          panOnScroll={true}
          selectionMode={SelectionMode.Partial}
        >
          <Background 
            patternColor="rgba(255, 255, 255, 0.3)"
            gap={32}
            size={1.5}
          />
        </ReactFlow>
      </div>
    </FlowContext.Provider>
  );
}

export default function App() {
  // View mode: 'dashboard' or 'canvas'
  const [viewMode, setViewMode] = useState<'dashboard' | 'canvas'>('dashboard');
  
  // Workflow management state
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const [workflowTitle, setWorkflowTitle] = useState<string>('Untitled Workflow');
  const [isLoadingWorkflows, setIsLoadingWorkflows] = useState(false);
  const [isSavingWorkflow, setIsSavingWorkflow] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Canvas state
  const [showTestPage, setShowTestPage] = useState(false);
  const [title, setTitle] = useState('untitled-flow');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<CanvasNode | null>(null);
  const [nodeUpdateHandler, setNodeUpdateHandler] = useState<((nodeId: string, data: any) => void) | null>(null);
  const nodeUpdateHandlerRef = useRef<((nodeId: string, data: any) => void) | null>(null);
  const [nodeRunHandler, setNodeRunHandler] = useState<((nodeId: string, runs: number, prompt?: string) => void) | null>(null);
  const nodeRunHandlerRef = useRef<((nodeId: string, runs: number, prompt?: string) => void) | null>(null);
  const [deselectNodesHandler, setDeselectNodesHandler] = useState<(() => void) | null>(null);
  const [canvasEdges, setCanvasEdges] = useState<Edge[]>([]);
  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([]);
  const [viewport, setViewport] = useState<ViewState>({ x: 0, y: 0, zoom: 1 });

  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [groupNodesHandler, setGroupNodesHandler] = useState<(() => void) | null>(null);
  const [cursorMode, setCursorMode] = useState<'pointer' | 'hand'>('hand');
  
  // Track last saved state to prevent unnecessary saves/dirty flags
  const lastSavedStateRef = useRef<string>('');

  // Refs to access current state in stable callbacks (prevents save loop)
  const canvasNodesRef = useRef<CanvasNode[]>([]);
  const canvasEdgesRef = useRef<Edge[]>([]);
  const workflowTitleRef = useRef<string>('Untitled Workflow');
  const currentWorkflowIdRef = useRef<string | null>(null);
  const viewportRef = useRef<ViewState>({ x: 0, y: 0, zoom: 1 });
  const isSavingRef = useRef<boolean>(false);
  const debouncedAutoSaveRef = useRef<DebouncedFunction<() => Promise<void>> | null>(null);

  // Keep refs in sync with state (for stable callback access)
  useEffect(() => { canvasNodesRef.current = canvasNodes; }, [canvasNodes]);
  useEffect(() => { canvasEdgesRef.current = canvasEdges; }, [canvasEdges]);
  useEffect(() => { workflowTitleRef.current = workflowTitle; }, [workflowTitle]);
  useEffect(() => { currentWorkflowIdRef.current = currentWorkflowId; }, [currentWorkflowId]);
  useEffect(() => { viewportRef.current = viewport; }, [viewport]);

  // Current filters (stored for re-fetching)
  const currentFiltersRef = useRef<WorkflowFilters>({});

  // Load all workflows with optional filters
  const loadAllWorkflows = async (showLoading: boolean = true, filters?: WorkflowFilters) => {
    try {
      console.log('🔄 Loading workflows...', filters);
      if (showLoading) setIsLoadingWorkflows(true);

      // Use filtered listing if filters provided, otherwise use basic listing
      if (filters && Object.keys(filters).some(k => filters[k as keyof WorkflowFilters] !== undefined)) {
        console.log('📡 Calling apiService.listWorkflowsFiltered()');
        const response = await apiService.listWorkflowsFiltered(filters);
        console.log('✅ Response received:', response);
        setWorkflows(response.workflows || []);
        console.log('📋 Workflows set:', response.workflows?.length || 0, 'workflows');
      } else {
        console.log('📡 Calling apiService.listWorkflows()');
        const response = await apiService.listWorkflows();
        console.log('✅ Response received:', response);
        setWorkflows(response.workflows || []);
        console.log('📋 Workflows set:', response.workflows?.length || 0, 'workflows');
      }
    } catch (error) {
      console.error('❌ Failed to load workflows:', error);
      // Only clear workflows if we were showing a loading screen (meaning we expected a full refresh)
      // For silent background updates, keep the old list if the request fails
      if (showLoading) {
        setWorkflows([]);
      }
    } finally {
      if (showLoading) setIsLoadingWorkflows(false);
    }
  };

  // Handle filter changes from dashboard
  const handleDashboardFiltersChange = useCallback((filters: WorkflowFilters) => {
    console.log('🔍 Dashboard filters changed:', filters);
    currentFiltersRef.current = filters;
    loadAllWorkflows(false, filters);
  }, []);

  // Load workflows on mount
  useEffect(() => {
    console.log('🚀 App mounted, calling loadAllWorkflows');
    loadAllWorkflows();
  }, []);

  // Load a specific workflow
  const handleLoadWorkflow = async (workflowId: string, initialTitle?: string) => {
    // 1. Immediately switch view and show loading state
    console.log('📂 [App] Starting workflow load:', workflowId);
    setWorkflowTitle(initialTitle || 'Loading...');
    setTitle(initialTitle || 'Loading...');
    setCurrentWorkflowId(workflowId);
    setHasUnsavedChanges(false);
    
    // Switch to canvas immediately
    setViewMode('canvas');
    setCursorMode('hand'); // Ensure we always start in hand mode
    setIsLoadingWorkflows(true);

    try {
      console.log('📂 [App] Fetching workflow data...');
      const response = await apiService.getWorkflow(workflowId);
      console.log('✅ [App] Workflow loaded:', response);
      
      const workflow = response.workflow;
      
      if (!workflow.id) {
        throw new Error('Workflow ID missing in response');
      }
      
      // Update with actual data
      setWorkflowTitle(workflow.title || 'Untitled Workflow');
      setTitle(workflow.title || 'Untitled Workflow');
      setCanvasNodes(workflow.nodes || []);
      setCanvasEdges(workflow.edges || []);
      
      if (workflow.viewState) {
        setViewport(workflow.viewState);
      }
      
      // Initialize last saved state (excluding viewport so panning doesn't trigger "unsaved")
      lastSavedStateRef.current = JSON.stringify({
        nodes: workflow.nodes || [],
        edges: workflow.edges || [],
        title: workflow.title || 'Untitled Workflow'
      });
      
    } catch (error) {
      console.error('❌ [App] Failed to load workflow:', error);
      // Optional: Show error toast or redirect back
      // setViewMode('dashboard'); 
    } finally {
      setIsLoadingWorkflows(false);
      console.log('📂 [App] Load process finished');
    }
  };

  // Create new workflow
  const handleNewWorkflow = () => {
    if (hasUnsavedChanges && currentWorkflowId) {
      if (!confirm('You have unsaved changes. Create a new workflow anyway?')) {
        return;
      }
    }
    
    setCurrentWorkflowId(null);
    setWorkflowTitle('Untitled Workflow');
    setTitle('untitled-flow');
    setCanvasNodes([]);
    setCanvasEdges([]);
    setViewport({ x: 0, y: 0, zoom: 1 });
    setHasUnsavedChanges(false);
    setViewMode('canvas');
    setCursorMode('hand'); // Ensure we always start in hand mode
    lastSavedStateRef.current = ''; // Reset saved state for new workflow
  };

  // Save workflow
  const handleSaveWorkflow = async () => {
    if (isSavingRef.current) {
      console.log('💾 [App] Save already in progress, skipping');
      return;
    }

    // Cancel pending auto-save to prevent duplicate saves
    debouncedAutoSaveRef.current?.cancel();

    // Read from refs to get the latest values (avoids stale closure issue)
    const currentNodes = canvasNodesRef.current;
    const currentEdges = canvasEdgesRef.current;
    const currentId = currentWorkflowIdRef.current;
    const currentTitle = workflowTitleRef.current;
    const currentViewport = viewportRef.current;

    try {
      isSavingRef.current = true;
      console.log('═══════════════════════════════════════════════════');
      console.log('💾 [App] ========== SAVE WORKFLOW START ==========');
      console.log('═══════════════════════════════════════════════════');
      console.log('💾 [App] Current workflow ID:', currentId || 'NEW WORKFLOW');
      console.log('💾 [App] Workflow title:', currentTitle);
      console.log('💾 [App] Nodes count:', currentNodes.length);
      console.log('💾 [App] Edges count:', currentEdges.length);
      console.log('💾 [App] Viewport:', JSON.stringify(currentViewport));
      
      // Log node details including imageUrl
      if (currentNodes.length > 0) {
        console.log('💾 [App] Nodes details:');
        currentNodes.forEach((node, index) => {
          const hasImageUrl = !!node.data.imageUrl;
          const imageUrlPreview = node.data.imageUrl 
            ? (node.data.imageUrl.startsWith('http') 
                ? node.data.imageUrl.substring(0, 60) + '...' 
                : node.data.imageUrl.startsWith('data:')
                ? 'base64 data (' + node.data.imageUrl.length + ' chars)'
                : node.data.imageUrl.substring(0, 30) + '...')
            : 'none';
          
          console.log(`  [${index}] ID: ${node.id}, Type: ${node.type}, Position: (${node.position.x}, ${node.position.y}), Has imageUrl: ${hasImageUrl}`);
          if (hasImageUrl) {
            console.log(`      📸 imageUrl: ${imageUrlPreview}`);
          }
        });
      }
      
      // Log edge details
      if (currentEdges.length > 0) {
        console.log('💾 [App] Edges details:');
        currentEdges.forEach((edge, index) => {
          console.log(`  [${index}] ${edge.source} → ${edge.target} (ports: ${edge.sourcePortIndex} → ${edge.targetPortIndex})`);
        });
      }
      
      setIsSavingWorkflow(true);

      const workflow: Workflow = {
        id: currentId || undefined,
        title: currentTitle || 'Untitled Workflow',
        nodes: currentNodes,
        edges: currentEdges,
        viewState: currentViewport
      };
      
      console.log('💾 [App] Workflow object created:', {
        id: workflow.id || 'undefined (will create new)',
        title: workflow.title,
        nodesCount: workflow.nodes.length,
        edgesCount: workflow.edges.length,
        hasViewState: !!workflow.viewState,
        viewState: workflow.viewState
      });
      
      console.log('💾 [App] Full workflow payload:', JSON.stringify(workflow, null, 2));
      
      console.log('💾 [App] Calling apiService.saveWorkflow()...');
      const startTime = Date.now();
      const response = await apiService.saveWorkflow(workflow);
      const duration = Date.now() - startTime;
      console.log(`✅ [App] Save response received (took ${duration}ms):`, response);
      
      // Update workflow ID if it was a new workflow
      if (!currentId && response.workflow.id) {
        console.log('🆕 [App] New workflow created!');
        console.log('🆕 [App] Old ID: null → New ID:', response.workflow.id);
        setCurrentWorkflowId(response.workflow.id);
      } else if (currentId) {
        console.log('🔄 [App] Existing workflow updated, ID:', currentId);
      }
      
      // Update title only if it actually changed (prevents save loop)
      if (response.workflow.title && response.workflow.title !== workflowTitleRef.current) {
        console.log('📝 [App] Title update:', workflowTitleRef.current, '→', response.workflow.title);
        setWorkflowTitle(response.workflow.title);
        setTitle(response.workflow.title);
      }
      
      // Update last saved state (excluding viewport)
      lastSavedStateRef.current = JSON.stringify({
        nodes: currentNodes,
        edges: currentEdges,
        title: response.workflow.title || currentTitle
      });
      
      setHasUnsavedChanges(false);
      console.log('✅ [App] Workflow saved successfully!');
      console.log('✅ [App] Response workflow:', {
        id: response.workflow.id,
        title: response.workflow.title,
        nodesCount: response.workflow.nodes?.length || 0,
        edgesCount: response.workflow.edges?.length || 0
      });
      
      // Refresh workflow list without showing loading screen
      console.log('🔄 [App] Refreshing workflow list...');
      await loadAllWorkflows(false);
      
      console.log('═══════════════════════════════════════════════════');
      console.log('✅ [App] ========== SAVE WORKFLOW SUCCESS ==========');
      console.log('═══════════════════════════════════════════════════');
    } catch (error) {
      console.error('═══════════════════════════════════════════════════');
      console.error('❌ [App] ========== SAVE WORKFLOW ERROR ==========');
      console.error('═══════════════════════════════════════════════════');
      console.error('❌ [App] Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('❌ [App] Error message:', error instanceof Error ? error.message : String(error));
      console.error('❌ [App] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('❌ [App] Workflow that failed:', {
        id: currentId,
        title: currentTitle,
        nodesCount: currentNodes.length,
        edgesCount: currentEdges.length
      });
      console.error('═══════════════════════════════════════════════════');
      // Show error to user
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to save workflow: ${errorMessage}`);
      // Keep hasUnsavedChanges true so user knows data wasn't saved
      setHasUnsavedChanges(true);
    } finally {
      isSavingRef.current = false;
      setIsSavingWorkflow(false);
      console.log('💾 [App] Save workflow process completed');
    }
  };

  // Delete workflow
  const handleDeleteWorkflow = async (workflowId: string) => {
    try {
      await apiService.deleteWorkflow(workflowId);
      
      // If deleting current workflow, go back to dashboard
      if (currentWorkflowId === workflowId) {
        handleNewWorkflow();
        setViewMode('dashboard');
      }
      
      // Refresh workflow list
      await loadAllWorkflows();
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      // alert('Failed to delete workflow'); // Disabled - errors logged to console
    }
  };

  // Stable auto-save function - reads from refs to avoid recreation
  const performAutoSave = useCallback(async () => {
    if (isSavingRef.current) return;

    const nodes = canvasNodesRef.current;
    const edges = canvasEdgesRef.current;
    if (nodes.length === 0 && edges.length === 0) return;

    const currentState = JSON.stringify({
      nodes,
      edges,
      title: workflowTitleRef.current
    });
    if (currentState === lastSavedStateRef.current) return;

    await handleSaveWorkflow();
  }, []); // Empty deps - reads from refs

  // Create debounced function once on mount
  useEffect(() => {
    debouncedAutoSaveRef.current = debounce(performAutoSave, 2000);
    return () => { debouncedAutoSaveRef.current?.cancel(); };
  }, [performAutoSave]);

  // Stable trigger function
  const triggerDebouncedAutoSave = useCallback(() => {
    debouncedAutoSaveRef.current?.();
  }, []);

  // Auto-save and Dirty Check
  useEffect(() => {
    const currentState = JSON.stringify({
      nodes: canvasNodes,
      edges: canvasEdges,
      title: workflowTitle
    });

    if (currentState === lastSavedStateRef.current) return;

    if (canvasNodes.length > 0 || canvasEdges.length > 0) {
      setHasUnsavedChanges(true);
      triggerDebouncedAutoSave();
    }
  }, [canvasNodes, canvasEdges, workflowTitle, triggerDebouncedAutoSave]);

  // Sync selectedNodeData when canvasNodes updates (if it's the selected node)
  useEffect(() => {
    if (selectedNodeId && canvasNodes.length > 0) {
      const updatedNode = canvasNodes.find(n => n.id === selectedNodeId);
      if (updatedNode) {
        // Use functional update to compare with previous value
        setSelectedNodeData(prev => {
          // Return the updated node from canvasNodes (find it fresh to avoid stale closure)
          const freshNode = canvasNodes.find(n => n.id === selectedNodeId);
          return freshNode || updatedNode;
        });
      }
    }
  }, [canvasNodes, selectedNodeId]);
  
  const [nodePickerPosition, setNodePickerPosition] = useState<{
    x: number;
    y: number;
    sourceOutputType?: DataType;
    sourcePortIndex?: number;
    sourceNodeId?: string;
  } | null>(null);

  const handleNodeUpdateReady = useCallback((handler: (nodeId: string, data: any) => void) => {
    setNodeUpdateHandler(() => handler);
    nodeUpdateHandlerRef.current = handler;
  }, []);

  const handleNodeRunReady = useCallback((handler: (nodeId: string, runs: number, prompt?: string) => void) => {
    setNodeRunHandler(() => handler);
    nodeRunHandlerRef.current = handler;
  }, []);

  const handleDeselectReady = useCallback((handler: () => void) => {
    setDeselectNodesHandler(() => handler);
  }, []);

  // Cursor mode keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      
      if (e.key === 'v' || e.key === 'V') {
        setCursorMode('pointer');
      } else if (e.key === 'h' || e.key === 'H') {
        setCursorMode('hand');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Memoize the onEdgesAndNodesReady callback to prevent infinite re-render loop
  const handleEdgesAndNodesReady = useCallback((edges: Edge[], nodes: CanvasNode[]) => {
    // Compare node data including imageUrl, content, and other important fields to detect changes
    const nodesChanged = JSON.stringify(canvasNodes.map(n => ({ 
      id: n.id, 
      type: n.type,
      imageUrl: n.data.imageUrl,
      content: n.data.content,
      status: n.data.status,
      label: n.data.label
    }))) !== JSON.stringify(nodes.map(n => ({ 
      id: n.id, 
      type: n.type,
      imageUrl: n.data.imageUrl,
      content: n.data.content,
      status: n.data.status,
      label: n.data.label
    })));
    
    const edgesChanged = JSON.stringify(canvasEdges.map(e => ({ id: e.id, source: e.source, target: e.target }))) !== 
                        JSON.stringify(edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
    
    if (nodesChanged || edgesChanged) {
      console.log('🔄 [App] Nodes/edges changed, updating canvasNodes and canvasEdges');
      if (nodesChanged) {
        // Log which nodes have imageUrl
        nodes.forEach(node => {
          if (node.data.imageUrl) {
            const preview = node.data.imageUrl.startsWith('http') 
              ? node.data.imageUrl.substring(0, 50) + '...'
              : 'base64 or other format';
            console.log(`  📸 Node ${node.id} (${node.type}) has imageUrl: ${preview}`);
          }
        });
      }
      setCanvasEdges(edges);
      setCanvasNodes(nodes);
    }
  }, [canvasNodes, canvasEdges]);
  
  const onDragStart = (e: React.DragEvent, type: NodeType) => {
    // Set data in multiple formats for better compatibility
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.setData('text/plain', type); // Fallback for some browsers
    e.dataTransfer.effectAllowed = 'move';
  };
  
  
  const handleNodePickerSelect = useCallback((type: NodeType) => {
    if (!nodePickerPosition) return;
    // This will be handled by FlowCanvas through a ref or callback
    setNodePickerPosition(null);
  }, [nodePickerPosition]);
  
  // Sync selectedNodeData when nodeUpdateHandler updates a node
  // This effect will be triggered when nodeUpdateHandler is called from RightPanel
  // The actual update happens in the onUpdate callback of RightPanel
  
  // Show test page if enabled
  if (showTestPage) {
    return <ApiTestPage onBack={() => setShowTestPage(false)} />;
  }

  // Show dashboard if in dashboard mode
  if (viewMode === 'dashboard') {
    return (
      <WorkflowDashboard
        workflows={workflows}
        onOpenWorkflow={handleLoadWorkflow}
        onNewWorkflow={handleNewWorkflow}
        onDeleteWorkflow={handleDeleteWorkflow}
        onFiltersChange={handleDashboardFiltersChange}
        isLoading={isLoadingWorkflows}
      />
    );
  }
  
  return (
    <ReactFlowProvider>
      <div className="relative h-screen w-screen overflow-hidden bg-[#050506] text-gray-300">
        {/* Top Toolbar */}
        <div className="absolute top-0 left-0 right-0 z-30 h-14 border-b border-white/5 bg-[#0e0e11] px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => {
                if (hasUnsavedChanges) {
                  if (confirm('You have unsaved changes. Go back to dashboard?')) {
                    setViewMode('dashboard');
                  }
                } else {
                  setViewMode('dashboard');
                }
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <input
              type="text"
              value={workflowTitle}
              onChange={(e) => {
                setWorkflowTitle(e.target.value);
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="bg-[#1a1b1e] border border-white/5 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30 min-w-[200px]"
              placeholder="Workflow name..."
            />
            {hasUnsavedChanges && (
              <span className="text-xs text-gray-500">Unsaved changes</span>
            )}
            {isSavingWorkflow && (
              <span className="text-xs text-gray-500">Saving...</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedNodeIds.length > 1 && (
              <button
                onClick={() => {
                  if (groupNodesHandler) {
                    groupNodesHandler();
                  }
                }}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 border border-white/5"
              >
                <Group size={14} />
                Group
              </button>
            )}
            <button
              onClick={handleSaveWorkflow}
              disabled={isSavingWorkflow || !hasUnsavedChanges}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isSavingWorkflow || !hasUnsavedChanges 
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isSavingWorkflow ? 'Saving...' : hasUnsavedChanges ? 'Save' : 'Saved'}
            </button>
          </div>
        </div>
        
        {/* Sidebar */}
        <aside className="absolute left-0 top-14 z-20 flex h-[calc(100vh-3.5rem)] w-[280px] flex-col border-r border-white/5 bg-[#0e0e11] py-4">
          <div className="px-6 mb-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-8 rounded-full bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all hover:scale-110" />
              <span className="text-sm font-bold tracking-tight text-white">{workflowTitle}</span>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
              <input 
                type="text" 
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-[#1a1b1e] pl-9 pr-4 py-2.5 text-xs text-gray-400 outline-none ring-1 ring-white/5 focus:ring-purple-500/30"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            <SidebarCategory title="Quick access">
              <div className="grid grid-cols-2 gap-2">
                {SIDEBAR_ITEMS.filter(item => item.category === 'quick-access').map(item => (
                  <SidebarDraggableItem key={item.id} item={item} onDragStart={onDragStart} />
                ))}
              </div>
            </SidebarCategory>

            <SidebarCategory title="Toolbox">
              <div className="flex flex-col gap-6">
                 <div>
                   <span className="text-[10px] font-bold text-gray-600 uppercase mb-3 block px-2 tracking-tighter">Editing</span>
                   <div className="grid grid-cols-2 gap-2">
                     {SIDEBAR_ITEMS.filter(item => item.category === 'toolbox' && item.subCategory === 'editing').map(item => (
                       <SidebarDraggableItem key={item.id} item={item} onDragStart={onDragStart} />
                     ))}
                   </div>
                 </div>
                 <div>
                   <span className="text-[10px] font-bold text-gray-600 uppercase mb-3 block px-2 tracking-tighter">Text tools</span>
                   <div className="grid grid-cols-2 gap-2">
                     {SIDEBAR_ITEMS.filter(item => item.category === 'toolbox' && item.subCategory === 'text').map(item => (
                       <SidebarDraggableItem key={item.id} item={item} onDragStart={onDragStart} />
                     ))}
                   </div>
                 </div>
                 <div>
                   <span className="text-[10px] font-bold text-gray-600 uppercase mb-3 block px-2 tracking-tighter">Functions</span>
                   <div className="grid grid-cols-2 gap-2">
                     {SIDEBAR_ITEMS.filter(item => item.category === 'toolbox' && item.subCategory === 'functions').map(item => (
                       <SidebarDraggableItem key={item.id} item={item} onDragStart={onDragStart} />
                     ))}
                   </div>
                 </div>
              </div>
            </SidebarCategory>

            <SidebarCategory title="Image Models">
              <div className="grid grid-cols-2 gap-2">
                {SIDEBAR_ITEMS.filter(item => item.category === 'image-models').map(item => (
                  <SidebarDraggableItem key={item.id} item={item} onDragStart={onDragStart} />
                ))}
              </div>
            </SidebarCategory>

            <SidebarCategory title="Video Models">
              <div className="grid grid-cols-2 gap-2">
                {SIDEBAR_ITEMS.filter(item => item.category === 'video-models').map(item => (
                  <SidebarDraggableItem key={item.id} item={item} onDragStart={onDragStart} />
                ))}
              </div>
            </SidebarCategory>

            <SidebarCategory title="Lip Sync">
              <div className="grid grid-cols-2 gap-2">
                {SIDEBAR_ITEMS.filter(item => item.category === 'lip-sync').map(item => (
                  <SidebarDraggableItem key={item.id} item={item} onDragStart={onDragStart} />
                ))}
              </div>
            </SidebarCategory>

            <SidebarCategory title="Upscaling & Enhancement">
              <div className="grid grid-cols-2 gap-2">
                {SIDEBAR_ITEMS.filter(item => item.category === 'upscaling').map(item => (
                  <SidebarDraggableItem key={item.id} item={item} onDragStart={onDragStart} />
                ))}
              </div>
            </SidebarCategory>

            <SidebarCategory title="3D Generation">
              <div className="grid grid-cols-2 gap-2">
                {SIDEBAR_ITEMS.filter(item => item.category === '3d-gen').map(item => (
                  <SidebarDraggableItem key={item.id} item={item} onDragStart={onDragStart} />
                ))}
              </div>
            </SidebarCategory>

            <SidebarCategory title="Audio / TTS">
              <div className="grid grid-cols-2 gap-2">
                {SIDEBAR_ITEMS.filter(item => item.category === 'audio-tts').map(item => (
                  <SidebarDraggableItem key={item.id} item={item} onDragStart={onDragStart} />
                ))}
              </div>
            </SidebarCategory>

            <SidebarCategory title="Utility">
              <div className="grid grid-cols-2 gap-2">
                {SIDEBAR_ITEMS.filter(item => item.category === 'utility').map(item => (
                  <SidebarDraggableItem key={item.id} item={item} onDragStart={onDragStart} />
                ))}
              </div>
            </SidebarCategory>
          </div>

          <div className="mt-auto px-6 py-4 flex items-center justify-between border-t border-white/5">
             <div className="flex gap-4">
                <HelpCircle size={18} className="text-gray-500 hover:text-white cursor-pointer" />
                <div className="h-5 w-5 rounded bg-gray-500/20 flex items-center justify-center text-gray-500 hover:text-white cursor-pointer">
                  <span className="text-[10px] font-bold">D</span>
                </div>
             </div>
          </div>
        </aside>

        <header className="absolute left-[280px] top-0 z-10 flex h-16 items-center justify-end px-8 pointer-events-none transition-all right-0">
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="flex items-center gap-2 rounded-xl bg-[#1a1b1e] px-4 py-2 text-xs font-medium text-gray-400">
              <Sparkles size={14} className="text-yellow-500" />
              <span>150 credits</span>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 text-xs font-bold text-white transition-colors">
              <Share2 size={16} />
              Share
            </button>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 text-xs font-medium text-white transition-colors cursor-pointer">
              Tasks <ChevronDown size={14} />
            </div>
          </div>
        </header>

        <main className={`relative h-[calc(100vh-3.5rem)] bg-[#050506] overflow-hidden transition-all ml-[280px] mt-14 ${selectedNodeData && NODE_PANEL_CONFIG[selectedNodeData.type] && NODE_PANEL_CONFIG[selectedNodeData.type]!.length > 0 ? 'mr-[360px]' : ''}`}>
          
          {/* Loading Overlay */}
          {isLoadingWorkflows && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050506]/80 backdrop-blur-sm">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-600 border-t-transparent shadow-[0_0_15px_rgba(147,51,234,0.5)]" />
              <div className="mt-4 text-sm font-medium text-purple-400 animate-pulse">Loading Workflow...</div>
            </div>
          )}

          <FlowCanvas 
            initialNodes={canvasNodes}
            initialEdges={canvasEdges}
            initialViewport={viewport}
            workflowId={currentWorkflowId || 'temp'}
            onNodePickerOpen={setNodePickerPosition}
            onSelectedNodeChange={setSelectedNodeId}
            onSelectedNodeDataChange={setSelectedNodeData}
            onNodeUpdateHandlerReady={handleNodeUpdateReady}
            onNodeRunHandlerReady={handleNodeRunReady}
            onDeselectNodesReady={handleDeselectReady}
            onEdgesAndNodesReady={(edges, nodes) => {
              // Compare node data including imageUrl, content, and other important fields to detect changes
              const nodesChanged = JSON.stringify(canvasNodes.map(n => ({ 
                id: n.id, 
                type: n.type,
                imageUrl: n.data.imageUrl,
                content: n.data.content,
                status: n.data.status,
                label: n.data.label
              }))) !== JSON.stringify(nodes.map(n => ({ 
                id: n.id, 
                type: n.type,
                imageUrl: n.data.imageUrl,
                content: n.data.content,
                status: n.data.status,
                label: n.data.label
              })));
              
              const edgesChanged = JSON.stringify(canvasEdges.map(e => ({ id: e.id, source: e.source, target: e.target }))) !== 
                                  JSON.stringify(edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
              
              if (nodesChanged || edgesChanged) {
                console.log('🔄 [App] Nodes/edges changed, updating canvasNodes and canvasEdges');
                if (nodesChanged) {
                  // Log which nodes have imageUrl
                  nodes.forEach(node => {
                    if (node.data.imageUrl) {
                      const preview = node.data.imageUrl.startsWith('http') 
                        ? node.data.imageUrl.substring(0, 50) + '...'
                        : 'base64 or other format';
                      console.log(`  📸 Node ${node.id} (${node.type}) has imageUrl: ${preview}`);
                    }
                  });
                }
                setCanvasEdges(edges);
                setCanvasNodes(nodes);
              }
            }}
            onViewportChange={(vp) => {
              setViewport(vp);
            }}
            onGroupNodesReady={setGroupNodesHandler}
            onMultiSelectionChange={setSelectedNodeIds}
            cursorMode={cursorMode}
          />

          {/* Cursor Controls */}
          <div className="absolute bottom-6 left-6 flex items-center gap-1 rounded-lg border border-white/10 bg-[#1a1b1e] p-1 shadow-xl z-50">
            <button
              onClick={() => setCursorMode('pointer')}
              className={`p-2 rounded-md transition-colors ${cursorMode === 'pointer' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              title="Select (V)"
            >
              <MousePointer2 size={18} />
            </button>
            <button
              onClick={() => setCursorMode('hand')}
              className={`p-2 rounded-md transition-colors ${cursorMode === 'hand' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              title="Pan (H)"
            >
              <Hand size={18} />
            </button>
          </div>
        </main>
        
        {/* Right Panel */}
        {selectedNodeData && NODE_PANEL_CONFIG[selectedNodeData.type] && NODE_PANEL_CONFIG[selectedNodeData.type]!.length > 0 && (
          <RightPanel
            selectedNode={selectedNodeData}
            edges={canvasEdges}
            nodes={canvasNodes}
            onClose={() => {
              setSelectedNodeData(null);
              setSelectedNodeId(null);
              // Deselect nodes in ReactFlow
              if (deselectNodesHandler) {
                deselectNodesHandler();
              }
            }}
            onRun={(nodeId, runs, prompt) => {
              const handler = nodeRunHandlerRef.current;

              if (handler && typeof handler === 'function') {
                handler(nodeId, runs, prompt);
              }
            }}
            onUpdate={(nodeId, data) => {
              const handler = nodeUpdateHandlerRef.current;
              if (handler) {
                handler(nodeId, data);
                // Defer state update to avoid setState during render
                setTimeout(() => {
                  setSelectedNodeData(prev => {
                    if (!prev || prev.id !== nodeId) return prev;
                    const updated = {
                      ...prev,
                      data: {
                        ...prev.data,
                        ...data,
                        panelSettings: data?.panelSettings ? {
                          ...prev.data.panelSettings,
                          ...data.panelSettings
                        } : prev.data.panelSettings
                      }
                    };
                    return updated;
                  });
                }, 0);
              }
            }}
          />
        )}

        {/* Node Picker */}
        {nodePickerPosition && (
          <NodePicker
            x={nodePickerPosition.x}
            y={nodePickerPosition.y}
            sourceOutputType={nodePickerPosition.sourceOutputType}
            sourcePortIndex={nodePickerPosition.sourcePortIndex}
            onSelect={(type) => {
              // Handle node picker selection
              setNodePickerPosition(null);
            }}
            onClose={() => {
              setNodePickerPosition(null);
            }}
          />
        )}
      </div>
    </ReactFlowProvider>
  );
}
