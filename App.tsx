
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Search, Clock, Briefcase, Image as ImageIcon, 
  Play, Box, Sparkles, HelpCircle, MessageSquare, 
  Share2, ChevronDown, MousePointer2, Hand, 
  RotateCcw, RotateCw, Plus, Trash2, X,
  FileUp, FileDown, Eye, Database, Layers, Palette, Crop, Maximize2, Droplets,
  RefreshCcw, Video, ListFilter, Type, Wand2, PlusCircle, Brain, Camera, FileVideo,
  Hash, ToggleRight, List, Dice5, Braces, Film, Zap, Clapperboard, 
  Smile, UserCircle, MessageCircle, Waves, Volume2, Mic2, Music, 
  Activity, BoxSelect, Maximize, Scissors, Binary, Calculator, Globe, MapPin, 
  Terminal, Timer, Palette as PaletteIcon, Bird, Radio
} from 'lucide-react';
import { CanvasNode, Edge, ViewState, NodeType, SidebarItem } from './types';
import { generateAIContent, generateAIImage } from './services/geminiService';
import { NodeRenderer } from './components/NodeRenderer';

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'prompt_enhancer', label: 'Prompt Enhancer', icon: <Wand2 size={16} />, category: 'quick-access' },
  { id: 'import', label: 'Import', icon: <FileUp size={16} />, category: 'quick-access' },
  { id: 'export', label: 'Export', icon: <FileDown size={16} />, category: 'quick-access' },
  { id: 'preview', label: 'Preview', icon: <Eye size={16} />, category: 'quick-access' },
  
  // Toolbox Categories
  { id: 'levels', label: 'Levels', icon: <Layers size={16} />, category: 'toolbox', subCategory: 'editing' },
  { id: 'compositor', label: 'Compositor', icon: <ImageIcon size={16} />, category: 'toolbox', subCategory: 'editing' },
  { id: 'painter', label: 'Painter', icon: <Palette size={16} />, category: 'toolbox', subCategory: 'editing' },
  { id: 'crop', label: 'Crop', icon: <Crop size={16} />, category: 'toolbox', subCategory: 'editing' },
  { id: 'blur', label: 'Blur', icon: <Droplets size={16} />, category: 'toolbox', subCategory: 'editing' },
  { id: 'invert', label: 'Invert', icon: <RefreshCcw size={16} />, category: 'toolbox', subCategory: 'editing' },
  
  { id: 'any_llm', label: 'Any LLM', icon: <Brain size={16} />, category: 'toolbox', subCategory: 'text' },
  { id: 'image_describer', label: 'Image Describer', icon: <Camera size={16} />, category: 'toolbox', subCategory: 'text' },
  { id: 'text', label: 'Text', icon: <Type size={16} />, category: 'toolbox', subCategory: 'text' },
  
  { id: 'number', label: 'Number', icon: <Hash size={16} />, category: 'toolbox', subCategory: 'datatypes' },
  { id: 'toggle', label: 'Toggle', icon: <ToggleRight size={16} />, category: 'toolbox', subCategory: 'datatypes' },
  { id: 'list', label: 'List', icon: <List size={16} />, category: 'toolbox', subCategory: 'datatypes' },

  // Image Models Category
  { id: 'nano_banana_pro', label: 'Nano Banana Pro', icon: <Sparkles size={16} />, category: 'image-models' },
  { id: 'flux_pro_1_1_ultra', label: 'Flux Pro 1.1 Ultra', icon: <Zap size={16} />, category: 'image-models' },
  { id: 'flux_pro_1_1', label: 'Flux Pro 1.1', icon: <Zap size={16} />, category: 'image-models' },
  { id: 'flux_dev', label: 'Flux Dev', icon: <Zap size={16} />, category: 'image-models' },
  { id: 'flux_lora', label: 'Flux LoRA', icon: <Zap size={16} />, category: 'image-models' },
  { id: 'ideogram_v3', label: 'Ideogram V3', icon: <ImageIcon size={16} />, category: 'image-models' },
  { id: 'ideogram_v3_edit', label: 'Ideogram V3 Edit', icon: <Palette size={16} />, category: 'image-models' },
  { id: 'imagen_3', label: 'Imagen 3', icon: <ImageIcon size={16} />, category: 'image-models' },
  { id: 'imagen_3_fast', label: 'Imagen 3 Fast', icon: <ImageIcon size={16} />, category: 'image-models' },
  { id: 'minimax_image', label: 'Minimax Image', icon: <Film size={16} />, category: 'image-models' },

  // Video Models Category
  { id: 'veo_2', label: 'Veo 2', icon: <Film size={16} />, category: 'video-models' },
  { id: 'veo_2_i2v', label: 'Veo 2 I2V', icon: <Video size={16} />, category: 'video-models' },
  { id: 'veo_3_1', label: 'Veo 3.1', icon: <Film size={16} />, category: 'video-models' },
  { id: 'kling_2_6_pro', label: 'Kling 2.6 Pro', icon: <Clapperboard size={16} />, category: 'video-models' },
  { id: 'kling_2_1_pro', label: 'Kling 2.1 Pro', icon: <Clapperboard size={16} />, category: 'video-models' },
  { id: 'kling_2_0_master', label: 'Kling 2.0 Master', icon: <Clapperboard size={16} />, category: 'video-models' },
  { id: 'kling_1_6_pro', label: 'Kling 1.6 Pro', icon: <Clapperboard size={16} />, category: 'video-models' },
  { id: 'kling_1_6_standard', label: 'Kling 1.6 Standard', icon: <Clapperboard size={16} />, category: 'video-models' },
  { id: 'hunyuan_video_v1_5_i2v', label: 'Hunyuan Video V1.5 I2V', icon: <Video size={16} />, category: 'video-models' },
  { id: 'hunyuan_video_v1_5_t2v', label: 'Hunyuan Video V1.5 T2V', icon: <Type size={16} />, category: 'video-models' },
  { id: 'hunyuan_video_i2v', label: 'Hunyuan Video I2V', icon: <Video size={16} />, category: 'video-models' },
  { id: 'luma_ray_2', label: 'Luma Ray 2', icon: <Film size={16} />, category: 'video-models' },
  { id: 'luma_ray_2_flash', label: 'Luma Ray 2 Flash', icon: <Zap size={16} />, category: 'video-models' },
  { id: 'minimax_hailuo', label: 'Minimax/Hailuo', icon: <Video size={16} />, category: 'video-models' },
  { id: 'minimax_director', label: 'Minimax Director', icon: <Clapperboard size={16} />, category: 'video-models' },
  { id: 'pika_2_2', label: 'Pika 2.2', icon: <Film size={16} />, category: 'video-models' },
  { id: 'ltx_video', label: 'LTX Video', icon: <Play size={16} />, category: 'video-models' },
  { id: 'wan_i2v', label: 'Wan I2V', icon: <Video size={16} />, category: 'video-models' },

  // Lip Sync
  { id: 'kling_lipsync_a2v', label: 'Kling Lipsync A2V', icon: <Radio size={16} />, category: 'lip-sync' },
  { id: 'kling_lipsync_t2v', label: 'Kling Lipsync T2V', icon: <Type size={16} />, category: 'lip-sync' },
  { id: 'sync_lipsync_v1', label: 'Sync Lipsync V1', icon: <Activity size={16} />, category: 'lip-sync' },
  { id: 'sync_lipsync_v2', label: 'Sync Lipsync V2', icon: <Waves size={16} />, category: 'lip-sync' },
  { id: 'tavus_hummingbird', label: 'Tavus Hummingbird', icon: <Bird size={16} />, category: 'lip-sync' },
  { id: 'latent_sync', label: 'LatentSync', icon: <Sparkles size={16} />, category: 'lip-sync' },
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
      onDragStart={(e) => onDragStart(e, item.id)}
      className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-white/5 bg-[#1a1b1e] p-2 transition-all hover:bg-white/5 hover:border-white/10 cursor-grab active:cursor-grabbing"
    >
      <div className="text-gray-500 group-hover:text-white transition-colors">{item.icon}</div>
      <span className="text-[10px] text-center font-medium text-gray-500 group-hover:text-gray-300 transition-colors leading-tight">
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

export default function App() {
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [viewState, setViewState] = useState<ViewState>({ x: 0, y: 0, zoom: 1 });
  const [activeTool, setActiveTool] = useState<'select' | 'pan'>('select');
  const [isPanning, setIsPanning] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [title, setTitle] = useState('untitled-flow');
  const [searchQuery, setSearchQuery] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const deleteNode = useCallback((id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  }, [selectedNodeId]);

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

  const addNode = (type: NodeType, x?: number, y?: number) => {
    const finalX = x ?? (window.innerWidth / 2 - viewState.x - 140) / viewState.zoom;
    const finalY = y ?? (window.innerHeight / 2 - viewState.y - 100) / viewState.zoom;

    const newNode: CanvasNode = {
      id: `node-${Date.now()}`,
      type,
      position: { x: finalX, y: finalY },
      data: { 
        label: type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        content: '',
        status: 'idle'
      }
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const handleUpdateNode = (id: string, data: any) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n));
  };

  const onDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType') as NodeType;
    if (!type || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - viewState.x) / viewState.zoom;
    const y = (e.clientY - rect.top - viewState.y) / viewState.zoom;
    
    addNode(type, x - 140, y - 50);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'pan' || (e.button === 1)) {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    } else if (activeTool === 'select') {
      setSelectedNodeId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setViewState(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }

    if (draggedNodeId) {
      const dx = (e.clientX - lastMousePos.current.x) / viewState.zoom;
      const dy = (e.clientY - lastMousePos.current.y) / viewState.zoom;
      setNodes(prev => prev.map(n => 
        n.id === draggedNodeId 
          ? { ...n, position: { x: n.position.x + dx, y: n.position.y + dy } }
          : n
      ));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setViewState(prev => ({
        ...prev,
        zoom: Math.min(Math.max(prev.zoom * zoomFactor, 0.1), 5)
      }));
    } else {
      setViewState(prev => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  const runAINode = async (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (!node || node.data.status === 'loading') return;
    setNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, status: 'loading' } } : n));
    try {
      if (node.type === 'prompt_enhancer' || node.type === 'any_llm' || node.type === 'image_describer' || node.type === 'video_describer') {
        const text = await generateAIContent(node.data.content || '');
        setNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, content: text, status: 'success' } } : n));
      } else if (node.type === 'image' || node.type === 'nano_banana_pro') {
        const url = await generateAIImage(node.data.content || 'A beautiful futuristic landscape');
        setNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, imageUrl: url, status: 'success' } } : n));
      }
    } catch (err) {
      setNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, status: 'error' } } : n));
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050506] text-gray-300">
      {/* Sidebar */}
      <aside className="absolute left-0 top-0 z-20 flex h-full w-[280px] flex-col border-r border-white/5 bg-[#0e0e11] py-4">
        <div className="px-6 mb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-full bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all hover:scale-110" />
            <span className="text-sm font-bold tracking-tight text-white">{title}</span>
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

      <header className="absolute left-[280px] right-0 top-0 z-10 flex h-16 items-center justify-end px-8 pointer-events-none">
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

      <main 
        ref={canvasRef}
        className={`relative h-full w-full bg-[#050506] overflow-hidden`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div 
          className="absolute inset-0 opacity-[0.1]"
          style={{ 
            backgroundImage: `radial-gradient(circle at center, #ffffff 1px, transparent 0)`,
            backgroundSize: `${32 * viewState.zoom}px ${32 * viewState.zoom}px`,
            backgroundPosition: `${viewState.x}px ${viewState.y}px`
          }}
        />

        <div 
          style={{ 
            transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.zoom})`,
            transformOrigin: '0 0'
          }}
          className="absolute h-full w-full"
        >
          {nodes.map(node => (
            <div 
              key={node.id}
              style={{ left: node.position.x, top: node.position.y }}
              className="absolute z-10"
            >
              <NodeRenderer 
                node={node}
                selected={selectedNodeId === node.id}
                onDelete={deleteNode}
                onUpdate={handleUpdateNode}
                onRun={runAINode}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(node.id);
                  if (activeTool === 'select') {
                    setDraggedNodeId(node.id);
                    lastMousePos.current = { x: e.clientX, y: e.clientY };
                  }
                }}
              />
            </div>
          ))}

          <svg className="pointer-events-none absolute h-full w-full overflow-visible">
            {edges.map(edge => {
              const source = nodes.find(n => n.id === edge.source);
              const target = nodes.find(n => n.id === edge.target);
              if (!source || !target) return null;
              return (
                <line 
                  key={edge.id}
                  x1={source.position.x + 140}
                  y1={source.position.y + 100}
                  x2={target.position.x + 140}
                  y2={target.position.y + 100}
                  stroke="rgba(168, 85, 247, 0.4)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })}
          </svg>
        </div>
      </main>

      <div className="absolute bottom-10 left-[calc(50%+140px)] z-20 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/5 bg-[#161616]/80 p-1.5 shadow-2xl backdrop-blur-xl">
        <ToolbarButton 
          icon={<MousePointer2 size={18} />} 
          active={activeTool === 'select'} 
          onClick={() => setActiveTool('select')} 
          activeColor="bg-[#e2ff44]"
        />
        <ToolbarButton 
          icon={<Hand size={18} />} 
          active={activeTool === 'pan'} 
          onClick={() => setActiveTool('pan')} 
        />
        <div className="mx-2 h-6 w-px bg-white/10" />
        <ToolbarButton icon={<RotateCcw size={18} />} active={false} />
        <ToolbarButton icon={<RotateCw size={18} />} active={false} />
        <div className="mx-2 h-6 w-px bg-white/10" />
        <div className="flex items-center gap-2 px-3 text-xs font-bold text-gray-400 hover:text-white cursor-pointer transition-colors">
          {Math.round(viewState.zoom * 100)}%
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}
