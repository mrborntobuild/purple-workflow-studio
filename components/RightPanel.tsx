import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Info, Minus, Plus, ArrowRight, ChevronDown, Sparkles, X, Trash2, CheckCircle2 } from 'lucide-react';
import { CanvasNode, NodeType, Edge } from '../types';
import { NODE_PANEL_CONFIG, PanelFieldConfig, PanelFieldType } from './nodePanelConfig';
import { getConnectedValuesForNode } from '../utils/connectionUtils';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';

interface RightPanelProps {
  selectedNode: CanvasNode | null;
  edges?: Edge[];
  nodes?: CanvasNode[];
  onClose: () => void;
  onRun: (nodeId: string, runs: number, prompt?: string) => void; // Add prompt parameter
  onUpdate: (nodeId: string, data: any) => void;
}

const NODE_CATEGORIES_WITH_PANEL: NodeType[] = [
  // Image Models
  'nano_banana_pro', 'nano_banana_pro_edit', 'flux_pro_1_1_ultra', 'flux_pro_1_1', 'flux_dev', 'flux_lora',
  'ideogram_v3', 'ideogram_v3_edit', 'imagen_3', 'imagen_3_fast', 'minimax_image',
  // Video Models
  'veo_2', 'veo_2_i2v', 'veo_3_1', 'kling_2_6_pro', 'kling_2_1_pro', 'kling_2_0_master',
  'kling_1_6_pro', 'kling_1_6_standard', 'hunyuan_video_v1_5_i2v', 'hunyuan_video_v1_5_t2v',
  'hunyuan_video_i2v', 'luma_ray_2', 'luma_ray_2_flash', 'minimax_hailuo', 'minimax_director',
  'pika_2_2', 'ltx_video', 'wan_i2v',
  // Lip Sync
  'kling_lipsync_a2v', 'kling_lipsync_t2v', 'sync_lipsync_v1', 'sync_lipsync_v2',
  'tavus_hummingbird', 'latent_sync',
  // Upscaling & Enhancement
  'topaz_video', 'creative_upscaler', 'esrgan', 'thera', 'drct',
  // 3D Generation
  'trellis', 'hunyuan_3d_v2', 'hunyuan_3d_mini', 'hunyuan_3d_turbo',
  // Audio / TTS
  'minimax_speech_hd', 'minimax_speech_turbo', 'kokoro_tts', 'dia_tts', 'elevenlabs_tts',
  'elevenlabs_turbo', 'mmaudio_v2',
  // Utility
  'background_remove', 'image_to_svg', 'speech_to_text', 'whisper'
];

const getNodeCost = (nodeType: NodeType): number => {
  // Default cost - can be customized per node type
  return 5;
};

const getImageSizeOptions = (nodeType: NodeType): string[] => {
  if (nodeType.includes('video') || nodeType.includes('lipsync')) {
    return ['Match Input Video', '1080p', '720p', '480p'];
  }
  if (nodeType.includes('3d')) {
    return ['1024x1024', '2048x2048', '4096x4096'];
  }
  return ['Match Input Image', '1024x1024', '2048x2048', '512x512', '768x768'];
};

const isVideoModel = (nodeType: NodeType): boolean => {
  return nodeType.includes('video') || 
         nodeType === 'veo_2' || 
         nodeType === 'veo_2_i2v' || 
         nodeType === 'veo_3_1' ||
         nodeType.startsWith('kling_') ||
         nodeType.startsWith('hunyuan_video') ||
         nodeType.startsWith('luma_') ||
         nodeType.startsWith('minimax_') ||
         nodeType === 'pika_2_2' ||
         nodeType === 'ltx_video' ||
         nodeType === 'wan_i2v';
};

export const RightPanel: React.FC<RightPanelProps> = ({ 
  selectedNode, 
  edges = [], 
  nodes = [], 
  onClose, 
  onRun, 
  onUpdate 
}) => {
  // Get field configuration for this node type
  const fieldConfigs = selectedNode ? NODE_PANEL_CONFIG[selectedNode.type] || [] : [];
  
  // Get all connected values for this node
  const connectedValues = useMemo(() => {
    if (!selectedNode || !edges.length || !nodes.length) {
      return {} as Record<PanelFieldType, { value: any; sourceNodeId: string | null; isConnected: boolean }>;
    }
    return getConnectedValuesForNode(selectedNode, edges, nodes);
  }, [selectedNode, edges, nodes]);
  
  // Check if a field is connected
  const isFieldConnected = useCallback((fieldType: PanelFieldType): boolean => {
    return connectedValues[fieldType]?.isConnected || false;
  }, [connectedValues]);
  
  // Get connected value for a field
  const getFieldConnectedValue = useCallback((fieldType: PanelFieldType): any => {
    return connectedValues[fieldType]?.value ?? null;
  }, [connectedValues]);
  
  // Get connected images for nano_banana_pro and nano_banana_pro_edit
  const connectedImages = useMemo(() => {
    if (!selectedNode || (selectedNode.type !== 'nano_banana_pro' && selectedNode.type !== 'nano_banana_pro_edit') || !edges.length || !nodes.length) {
      return [];
    }
    
    const images: Array<{ 
      url: string; 
      portIndex: number; 
      sourceNodeId: string;
      sourceNodeLabel: string;
    }> = [];
    
    // Find all edges connected to this node's IMAGE ports (port index > 0, since 0 is PROMPT)
    const inputEdges = edges.filter(e => e.target === selectedNode.id && e.targetPortIndex > 0);
    
    inputEdges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      if (sourceNode?.data.imageUrl) {
        images.push({
          url: sourceNode.data.imageUrl,
          portIndex: edge.targetPortIndex,
          sourceNodeId: sourceNode.id,
          sourceNodeLabel: sourceNode.data.label || sourceNode.type
        });
      }
    });
    
    // Sort by port index
    return images.sort((a, b) => a.portIndex - b.portIndex);
  }, [selectedNode, edges, nodes]);
  
  // Track the last node ID we loaded settings for, to prevent reloading on status changes
  const lastLoadedNodeIdRef = useRef<string | null>(null);
  
  // Track if prompt has been saved
  const [promptSaved, setPromptSaved] = useState(false);

  // State for all possible field values
  const [fieldValues, setFieldValues] = useState<Record<PanelFieldType, any>>({
    prompt: '',
    image_url: '',
    tail_image_url: '',
    input_image_urls: '',
    mask_url: '',
    image_urls: '[]',
    aspect_ratio: 'Default',
    duration: 'Default',
    resolution: 'Default',
    negative_prompt: '',
    enhance_prompt: false,
    generate_audio: false,
    cfg_scale: '',
    guidance_scale: '',
    num_inference_steps: '',
    num_frames: '',
    enable_prompt_expansion: false,
    i2v_stability: false,
    loop: false,
    prompt_optimizer: false,
    expand_prompt: false,
    frames_per_second: '',
    guide_scale: '',
    shift: '',
    enable_safety_checker: false,
    acceleration: 'Default',
    num_images: '',
    output_format: 'Default',
    sync_mode: false,
    safety_tolerance: 'Default',
    image_prompt_strength: '',
    raw: false,
    limit_generations: false,
    enable_web_search: false,
    loras: '',
    rendering_speed: 'Default',
    color_palette: '',
    style_codes: '[]',
    style: 'Default',
    style_preset: 'Default',
    seed: '662545',
    seedRandom: true,
    image_size: 'Match Input Image',
    runs: 1,
  });

  // Auto-resize for prompt and negative_prompt textareas
  const promptDisplayValue = useMemo(() =>
    (connectedValues.prompt?.isConnected && connectedValues.prompt?.value != null)
      ? String(connectedValues.prompt.value)
      : String(fieldValues.prompt ?? ''),
    [connectedValues.prompt?.isConnected, connectedValues.prompt?.value, fieldValues.prompt]);
  const negativePromptDisplayValue = useMemo(() =>
    (connectedValues.negative_prompt?.isConnected && connectedValues.negative_prompt?.value != null)
      ? String(connectedValues.negative_prompt.value)
      : String(fieldValues.negative_prompt ?? ''),
    [connectedValues.negative_prompt?.isConnected, connectedValues.negative_prompt?.value, fieldValues.negative_prompt]);
  const promptTextareaResize = useAutoResizeTextarea(promptDisplayValue, { minHeight: 80, maxHeight: 400 });
  const negativePromptTextareaResize = useAutoResizeTextarea(negativePromptDisplayValue, { minHeight: 80, maxHeight: 400 });

  // Load settings from node when it changes
  useEffect(() => {
    if (!selectedNode) return;

    // Load prompt from node.data.content or panelSettings.prompt
    // Only reload if this is a different node (not just a status update)
    if (fieldConfigs.some(f => f.type === 'prompt')) {
      // Only reload prompt if this is a different node
      if (lastLoadedNodeIdRef.current !== selectedNode.id) {
        const settings = selectedNode.data.panelSettings;
        const loadedPrompt = selectedNode.data.content || settings?.prompt || '';
        setFieldValues(prev => ({
          ...prev,
          prompt: loadedPrompt
        }));
        lastLoadedNodeIdRef.current = selectedNode.id;
      }
    }

    // Load image_url from node.data.imageUrl if field exists
    if (fieldConfigs.some(f => f.type === 'image_url')) {
      setFieldValues(prev => ({ ...prev, image_url: selectedNode.data.imageUrl || '' }));
    }

    // Load input_image_urls from panelSettings if field exists
    if (fieldConfigs.some(f => f.type === 'input_image_urls')) {
      const settings = selectedNode.data.panelSettings;
      setFieldValues(prev => ({ ...prev, input_image_urls: settings?.inputImageUrls || '' }));
    }

    // Load mask_url from panelSettings if field exists
    if (fieldConfigs.some(f => f.type === 'mask_url')) {
      const settings = selectedNode.data.panelSettings;
      setFieldValues(prev => ({ ...prev, mask_url: settings?.maskUrl || '' }));
    }

    // Load image_urls from panelSettings if field exists
    if (fieldConfigs.some(f => f.type === 'image_urls')) {
      const settings = selectedNode.data.panelSettings;
      setFieldValues(prev => ({ ...prev, image_urls: settings?.imageUrls || (typeof settings?.imageUrls === 'string' ? settings.imageUrls : JSON.stringify(settings?.imageUrls || [])) }));
    }

    // Load other settings from panelSettings
    if (selectedNode.data.panelSettings) {
      const settings = selectedNode.data.panelSettings;
      setFieldValues(prev => ({
        ...prev,
        image_url: settings.imageUrl || (selectedNode.data.imageUrl || ''),
        tail_image_url: settings.tailImageUrl || '',
        input_image_urls: settings.inputImageUrls || '',
        mask_url: settings.maskUrl || '',
        image_urls: settings.imageUrls || (typeof settings.imageUrls === 'string' ? settings.imageUrls : JSON.stringify(settings.imageUrls || [])),
        aspect_ratio: settings.aspectRatio || 'Default',
        duration: settings.duration || 'Default',
        resolution: settings.resolution || 'Default',
        negative_prompt: settings.negativePrompt || '',
        enhance_prompt: settings.enhancePrompt || false,
        generate_audio: settings.generateAudio || false,
        cfg_scale: settings.cfgScale || '',
        guidance_scale: settings.guidanceScale || '',
        num_inference_steps: settings.numInferenceSteps || '',
        num_frames: settings.numFrames || '',
        enable_prompt_expansion: settings.enablePromptExpansion || false,
        i2v_stability: settings.i2vStability || false,
        loop: settings.loop || false,
        prompt_optimizer: settings.promptOptimizer || false,
        expand_prompt: settings.expandPrompt || false,
        frames_per_second: settings.framesPerSecond || '',
        guide_scale: settings.guideScale || '',
        shift: settings.shift || '',
        enable_safety_checker: settings.enableSafetyChecker || false,
        acceleration: settings.acceleration || 'Default',
        num_images: settings.numImages || '',
        output_format: settings.outputFormat || 'Default',
        sync_mode: settings.syncMode || false,
        safety_tolerance: settings.safetyTolerance || 'Default',
        image_prompt_strength: settings.imagePromptStrength || '',
        raw: settings.raw || false,
        limit_generations: settings.limitGenerations || false,
        enable_web_search: settings.enableWebSearch || false,
        loras: settings.loras || (typeof settings.loras === 'string' ? settings.loras : JSON.stringify(settings.loras || [])),
        rendering_speed: settings.renderingSpeed || 'Default',
        color_palette: settings.colorPalette || '',
        style_codes: settings.styleCodes || (typeof settings.styleCodes === 'string' ? settings.styleCodes : JSON.stringify(settings.styleCodes || [])),
        style: settings.style || 'Default',
        style_preset: settings.stylePreset || 'Default',
        seed: settings.seed || '662545',
        seedRandom: settings.seedRandom !== undefined ? settings.seedRandom : true,
        image_size: settings.imageSize || 'Match Input Image',
        runs: settings.runs || 1,
      }));
    } else {
      // Reset to defaults
      setFieldValues({
        prompt: selectedNode.data.content || '',
        image_url: selectedNode.data.imageUrl || '',
        tail_image_url: '',
        input_image_urls: '',
        mask_url: '',
        image_urls: '[]',
        aspect_ratio: 'Default',
        duration: 'Default',
        resolution: 'Default',
        negative_prompt: '',
        enhance_prompt: false,
        generate_audio: false,
        cfg_scale: '',
        guidance_scale: '',
        num_inference_steps: '',
        num_frames: '',
        enable_prompt_expansion: false,
        i2v_stability: false,
        loop: false,
        prompt_optimizer: false,
        expand_prompt: false,
        frames_per_second: '',
        guide_scale: '',
        shift: '',
        enable_safety_checker: false,
        acceleration: 'Default',
        num_images: '',
        output_format: 'Default',
        sync_mode: false,
        safety_tolerance: 'Default',
        image_prompt_strength: '',
        raw: false,
        limit_generations: false,
        enable_web_search: false,
        loras: '[]',
        rendering_speed: 'Default',
        color_palette: '',
        style_codes: '[]',
        style: 'Default',
        style_preset: 'Default',
        seed: '662545',
        seedRandom: true,
        image_size: 'Match Input Image',
        runs: 1,
      });
    }
    
    // Override with connected values if they exist (this happens after loading node data)
    Object.entries(connectedValues).forEach(([fieldType, connection]) => {
      if (connection.isConnected && connection.value !== null) {
        setFieldValues(prev => ({ ...prev, [fieldType]: connection.value }));
      }
    });
  }, [selectedNode?.id, fieldConfigs, connectedValues]);


  if (!selectedNode || fieldConfigs.length === 0) {
    return null;
  }

  const nodeCost = getNodeCost(selectedNode.type);
  const totalCost = nodeCost * (fieldValues.runs || 1);

  // Save settings whenever they change
  const saveSettings = (updates: Partial<typeof selectedNode.data.panelSettings>) => {
    if (!selectedNode) {
      return;
    }

    const currentSettings = selectedNode.data.panelSettings || {};
    const newSettings = {
      ...currentSettings,
      ...updates
    };

    onUpdate(selectedNode.id, {
      panelSettings: newSettings
    });
  };

  const handleFieldChange = (fieldType: PanelFieldType, value: any) => {
    setFieldValues(prev => {
      const newValues = { ...prev, [fieldType]: value };
      return newValues;
    });

    // Special handling for prompt (saves to both content and panelSettings.prompt)
    if (fieldType === 'prompt') {
      // Save immediately to both content and panelSettings
      const updateData = {
        content: value,
        panelSettings: {
          ...selectedNode.data.panelSettings,
          prompt: value
        }
      };

      onUpdate(selectedNode.id, updateData);

      // Also call saveSettings to ensure it's saved
      saveSettings({ prompt: value });

      // Show saved indicator
      setPromptSaved(true);
      setTimeout(() => setPromptSaved(false), 2000); // Hide after 2 seconds

      return;
    }

    // Special handling for image_url (saves to imageUrl)
    if (fieldType === 'image_url') {
      onUpdate(selectedNode.id, { imageUrl: value });
      saveSettings({ imageUrl: value });
      return;
    }

    // Special handling for input_image_urls (saves to inputImageUrls)
    if (fieldType === 'input_image_urls') {
      saveSettings({ inputImageUrls: value });
      return;
    }

    // Special handling for mask_url (saves to maskUrl)
    if (fieldType === 'mask_url') {
      saveSettings({ maskUrl: value });
      return;
    }

    // Special handling for image_urls (saves to imageUrls)
    if (fieldType === 'image_urls') {
      saveSettings({ imageUrls: value });
      return;
    }

    // Special handling for seed random
    if (fieldType === 'seed') {
      setFieldValues(prev => ({ ...prev, seedRandom: false }));
      saveSettings({ seed: value, seedRandom: false });
      return;
    }

    // Map field types to panelSettings keys
    const settingsMap: Record<string, any> = {
      aspect_ratio: { aspectRatio: value },
      duration: { duration: value },
      resolution: { resolution: value },
      negative_prompt: { negativePrompt: value },
      enhance_prompt: { enhancePrompt: value },
      generate_audio: { generateAudio: value },
      cfg_scale: { cfgScale: value },
      guidance_scale: { guidanceScale: value },
      num_inference_steps: { numInferenceSteps: value },
      num_frames: { numFrames: value },
      enable_prompt_expansion: { enablePromptExpansion: value },
      i2v_stability: { i2vStability: value },
      loop: { loop: value },
      prompt_optimizer: { promptOptimizer: value },
      expand_prompt: { expandPrompt: value },
      frames_per_second: { framesPerSecond: value },
      guide_scale: { guideScale: value },
      shift: { shift: value },
      enable_safety_checker: { enableSafetyChecker: value },
      acceleration: { acceleration: value },
      num_images: { numImages: value },
      output_format: { outputFormat: value },
      sync_mode: { syncMode: value },
      safety_tolerance: { safetyTolerance: value },
      image_prompt_strength: { imagePromptStrength: value },
      raw: { raw: value },
      limit_generations: { limitGenerations: value },
      enable_web_search: { enableWebSearch: value },
      loras: { loras: typeof value === 'string' ? value : JSON.stringify(value) },
      rendering_speed: { renderingSpeed: value },
      color_palette: { colorPalette: value },
      style_codes: { styleCodes: typeof value === 'string' ? value : JSON.stringify(value) },
      style: { style: value },
      style_preset: { stylePreset: value },
      image_size: { imageSize: value },
      runs: { runs: value },
      image_url: { imageUrl: value },
      tail_image_url: { tailImageUrl: value },
      input_image_urls: { inputImageUrls: value },
      mask_url: { maskUrl: value },
      image_urls: { imageUrls: value },
    };

    if (settingsMap[fieldType]) {
      saveSettings(settingsMap[fieldType]);
    }
  };

  const handleSeedRandomChange = (checked: boolean) => {
    setFieldValues(prev => ({ ...prev, seedRandom: checked }));
    if (checked) {
      const newSeed = Math.floor(Math.random() * 1000000).toString();
      setFieldValues(prev => ({ ...prev, seed: newSeed }));
      saveSettings({ seedRandom: true, seed: newSeed });
    } else {
      saveSettings({ seedRandom: false });
    }
  };

  const handleRun = () => {
    // Get the current prompt value - check if connected first, then use fieldValues
    const isPromptConnected = isFieldConnected('prompt');
    const connectedPromptValue = getFieldConnectedValue('prompt');

    // Determine the prompt to use:
    // 1. If connected, use the connected value (this is the source of truth)
    // 2. If not connected, use fieldValues.prompt (user typed value)
    // We always pass a value (never undefined) so runAINode can use it directly
    const currentPrompt = isPromptConnected
      ? (connectedPromptValue || '')  // Use connected value, empty string if null
      : (fieldValues.prompt || '');  // Use fieldValues, empty string if empty

    // Save the prompt to content and panelSettings for persistence
    // Only save if it's not connected (connected values come from source node)
    if (!isPromptConnected) {
      onUpdate(selectedNode.id, { content: currentPrompt });
    }

    // Save all current settings before running (INCLUDE PROMPT)
    saveSettings({
      prompt: currentPrompt, // Save prompt to panelSettings
      imageUrl: fieldValues.image_url,
      tailImageUrl: fieldValues.tail_image_url,
      inputImageUrls: fieldValues.input_image_urls,
      maskUrl: fieldValues.mask_url,
      imageUrls: fieldValues.image_urls,
      aspectRatio: fieldValues.aspect_ratio,
      duration: fieldValues.duration,
      resolution: fieldValues.resolution,
      negativePrompt: fieldValues.negative_prompt,
      enhancePrompt: fieldValues.enhance_prompt,
      generateAudio: fieldValues.generate_audio,
      cfgScale: fieldValues.cfg_scale,
      guidanceScale: fieldValues.guidance_scale,
      numInferenceSteps: fieldValues.num_inference_steps,
      numFrames: fieldValues.num_frames,
      enablePromptExpansion: fieldValues.enable_prompt_expansion,
      i2vStability: fieldValues.i2v_stability,
      loop: fieldValues.loop,
      promptOptimizer: fieldValues.prompt_optimizer,
      expandPrompt: fieldValues.expand_prompt,
      framesPerSecond: fieldValues.frames_per_second,
      guideScale: fieldValues.guide_scale,
      shift: fieldValues.shift,
      enableSafetyChecker: fieldValues.enable_safety_checker,
      acceleration: fieldValues.acceleration,
      numImages: fieldValues.num_images,
      outputFormat: fieldValues.output_format,
      syncMode: fieldValues.sync_mode,
      safetyTolerance: fieldValues.safety_tolerance,
      imagePromptStrength: fieldValues.image_prompt_strength,
      raw: fieldValues.raw,
      limitGenerations: fieldValues.limit_generations,
      enableWebSearch: fieldValues.enable_web_search,
      loras: fieldValues.loras,
      renderingSpeed: fieldValues.rendering_speed,
      colorPalette: fieldValues.color_palette,
      styleCodes: fieldValues.style_codes,
      style: fieldValues.style,
      stylePreset: fieldValues.style_preset,
      seed: fieldValues.seed,
      seedRandom: fieldValues.seedRandom,
      imageSize: fieldValues.image_size,
      runs: fieldValues.runs,
    });

    // Pass the prompt DIRECTLY through the callback - always pass currentPrompt (even if empty)
    // This ensures runAINode receives the prompt value explicitly set by the user
    onRun(selectedNode.id, fieldValues.runs, currentPrompt);
  };

  // Render a field based on its configuration
  const renderField = (fieldConfig: PanelFieldConfig) => {
    const { type, label, required, dataType, options, placeholder } = fieldConfig;
    const isConnected = isFieldConnected(type);
    const connectedValue = getFieldConnectedValue(type);
    const sourceNodeId = connectedValues[type]?.sourceNodeId;
    const value = isConnected && connectedValue !== null ? connectedValue : fieldValues[type];

    // Special handling for image_urls array field
    if (type === 'image_urls') {
      const urlsArray: string[] = (() => {
        if (!value) return [];
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : (value.includes(',') ? value.split(',').map(s => s.trim()) : [value]);
          } catch {
            return value.includes(',') ? value.split(',').map(s => s.trim()) : (value ? [value] : []);
          }
        }
        return Array.isArray(value) ? value : [];
      })();

      const updateUrlsArray = (newArray: string[]) => {
        handleFieldChange('image_urls', JSON.stringify(newArray));
      };

      const addUrl = () => {
        updateUrlsArray([...urlsArray, '']);
      };

      const removeUrl = (index: number) => {
        updateUrlsArray(urlsArray.filter((_, i) => i !== index));
      };

      const updateUrl = (index: number, newValue: string) => {
        const updated = [...urlsArray];
        updated[index] = newValue;
        updateUrlsArray(updated);
      };

      return (
        <div key={type} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <label className="text-xs font-medium text-gray-400">{label}</label>
            {required && <span className="text-[10px] text-red-400">*</span>}
            <Info size={12} className="text-gray-600" />
          </div>
          <div className="flex flex-col gap-2">
            {urlsArray.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  placeholder="Image URL (JPEG/PNG/WebP)"
                  className="flex-1 rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/30"
                />
                <button
                  onClick={() => removeUrl(index)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addUrl}
              className="flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-white transition-colors px-1 py-2"
            >
              <Plus size={16} />
              Add Image URL
            </button>
          </div>
        </div>
      );
    }

    // Special handling for color_palette field
    if (type === 'color_palette') {
      const parseColorPalette = (): { mode: 'preset' | 'custom', preset: string, colors: Array<{ hex: string; weight: number }> } => {
        if (!value) return { mode: 'preset', preset: '', colors: [] };
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            if (typeof parsed === 'string') {
              // It's a preset name
              return { mode: 'preset', preset: parsed, colors: [] };
            } else if (parsed && typeof parsed === 'object' && parsed.members) {
              // It's a custom color palette with members
              const colors = Object.entries(parsed.members).map(([hex, weight]) => ({
                hex: hex.startsWith('#') ? hex : `#${hex}`,
                weight: typeof weight === 'number' ? weight : parseFloat(weight as string) || 1
              }));
              return { mode: 'custom', preset: '', colors };
            } else if (parsed && typeof parsed === 'object' && parsed.name) {
              // It's a preset name in object form
              return { mode: 'preset', preset: parsed.name, colors: [] };
            }
          } catch {
            // If it's not valid JSON, treat as preset name
            return { mode: 'preset', preset: value, colors: [] };
          }
        }
        return { mode: 'preset', preset: '', colors: [] };
      };

      const [paletteState, setPaletteState] = useState(parseColorPalette());

      useEffect(() => {
        setPaletteState(parseColorPalette());
      }, [value]);

      const updateColorPalette = (newState: typeof paletteState) => {
        let jsonValue: string;
        if (newState.mode === 'preset' && newState.preset) {
          jsonValue = JSON.stringify(newState.preset);
        } else if (newState.mode === 'custom' && newState.colors.length > 0) {
          const members: Record<string, number> = {};
          newState.colors.forEach(({ hex, weight }) => {
            if (hex) {
              const cleanHex = hex.replace('#', '');
              members[cleanHex] = weight;
            }
          });
          jsonValue = JSON.stringify({ members });
        } else {
          jsonValue = '';
        }
        handleFieldChange('color_palette', jsonValue || null);
      };

      const addColor = () => {
        const newState = {
          ...paletteState,
          mode: 'custom' as const,
          colors: [...paletteState.colors, { hex: '#', weight: 1 }]
        };
        setPaletteState(newState);
        updateColorPalette(newState);
      };

      const removeColor = (index: number) => {
        const newState = {
          ...paletteState,
          colors: paletteState.colors.filter((_, i) => i !== index)
        };
        setPaletteState(newState);
        updateColorPalette(newState);
      };

      const updateColor = (index: number, field: 'hex' | 'weight', newValue: string | number) => {
        const updated = [...paletteState.colors];
        updated[index] = { ...updated[index], [field]: newValue };
        const newState = { ...paletteState, mode: 'custom' as const, colors: updated };
        setPaletteState(newState);
        updateColorPalette(newState);
      };

      const updatePreset = (presetName: string) => {
        const newState = { ...paletteState, mode: 'preset' as const, preset: presetName };
        setPaletteState(newState);
        updateColorPalette(newState);
      };

      const setMode = (mode: 'preset' | 'custom') => {
        const newState = { ...paletteState, mode };
        setPaletteState(newState);
        updateColorPalette(newState);
      };

      return (
        <div key={type} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <label className="text-xs font-medium text-gray-400">{label}</label>
            {required && <span className="text-[10px] text-red-400">*</span>}
            <Info size={12} className="text-gray-600" />
          </div>
          <div className="flex flex-col gap-3">
            {/* Mode selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setMode('preset')}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  paletteState.mode === 'preset'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-[#161719] text-gray-500 border border-white/5 hover:border-white/10'
                }`}
              >
                Preset
              </button>
              <button
                onClick={() => setMode('custom')}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  paletteState.mode === 'custom'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-[#161719] text-gray-500 border border-white/5 hover:border-white/10'
                }`}
              >
                Custom Colors
              </button>
            </div>

            {/* Preset mode */}
            {paletteState.mode === 'preset' && (
              <input
                type="text"
                value={paletteState.preset}
                onChange={(e) => updatePreset(e.target.value)}
                placeholder="Preset name"
                className="w-full rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/30"
              />
            )}

            {/* Custom colors mode */}
            {paletteState.mode === 'custom' && (
              <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                {paletteState.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-[#161719] border border-white/5">
                    <input
                      type="color"
                      value={color.hex || '#000000'}
                      onChange={(e) => updateColor(index, 'hex', e.target.value)}
                      className="h-8 w-10 rounded border border-white/5 cursor-pointer flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={color.hex}
                      onChange={(e) => updateColor(index, 'hex', e.target.value)}
                      placeholder="#000000"
                      className="flex-1 rounded-lg bg-[#1a1b1e] border border-white/5 px-2 py-1.5 text-xs text-gray-300 placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/30 font-mono"
                    />
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={color.weight}
                      onChange={(e) => updateColor(index, 'weight', parseFloat(e.target.value) || 0)}
                      placeholder="W"
                      className="w-12 rounded-lg bg-[#1a1b1e] border border-white/5 px-2 py-1.5 text-xs text-gray-300 placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/30 text-center"
                    />
                    <button
                      onClick={() => removeColor(index)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addColor}
                  className="flex items-center gap-2 text-[11px] font-medium text-gray-500 hover:text-white transition-colors px-1 py-1.5"
                >
                  <Plus size={14} />
                  Add Color
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Special handling for style_codes array field
    if (type === 'style_codes') {
      const codesArray: string[] = (() => {
        if (!value) return [];
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : (value.includes(',') ? value.split(',').map(s => s.trim()) : [value]);
          } catch {
            return value.includes(',') ? value.split(',').map(s => s.trim()) : (value ? [value] : []);
          }
        }
        return Array.isArray(value) ? value : [];
      })();

      const updateCodesArray = (newArray: string[]) => {
        handleFieldChange('style_codes', JSON.stringify(newArray));
      };

      const addCode = () => {
        updateCodesArray([...codesArray, '']);
      };

      const removeCode = (index: number) => {
        updateCodesArray(codesArray.filter((_, i) => i !== index));
      };

      const updateCode = (index: number, newValue: string) => {
        const updated = [...codesArray];
        updated[index] = newValue;
        updateCodesArray(updated);
      };

      return (
        <div key={type} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <label className="text-xs font-medium text-gray-400">{label}</label>
            {required && <span className="text-[10px] text-red-400">*</span>}
            <Info size={12} className="text-gray-600" />
          </div>
          <div className="flex flex-col gap-2">
            {codesArray.map((code, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => updateCode(index, e.target.value)}
                  placeholder="8-character hex code"
                  maxLength={8}
                  className="flex-1 rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/30 font-mono"
                />
                <button
                  onClick={() => removeCode(index)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addCode}
              className="flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-white transition-colors px-1 py-2"
            >
              <Plus size={16} />
              Add Style Code
            </button>
          </div>
        </div>
      );
    }

    // Special handling for loras array field
    if (type === 'loras') {
      const lorasArray: Array<{ path: string; scale: number }> = (() => {
        if (!value) return [];
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return Array.isArray(value) ? value : [];
      })();

      const updateLorasArray = (newArray: Array<{ path: string; scale: number }>) => {
        handleFieldChange('loras', JSON.stringify(newArray));
      };

      const addLora = () => {
        updateLorasArray([...lorasArray, { path: '', scale: 0.8 }]);
      };

      const removeLora = (index: number) => {
        updateLorasArray(lorasArray.filter((_, i) => i !== index));
      };

      const updateLora = (index: number, field: 'path' | 'scale', newValue: string | number) => {
        const updated = [...lorasArray];
        updated[index] = { ...updated[index], [field]: newValue };
        updateLorasArray(updated);
      };

      return (
        <div key={type} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <label className="text-xs font-medium text-gray-400">{label}</label>
            {required && <span className="text-[10px] text-red-400">*</span>}
            <Info size={12} className="text-gray-600" />
          </div>
          <div className="flex flex-col gap-2">
            {lorasArray.map((lora, index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-[#161719] border border-white/5">
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    value={lora.path}
                    onChange={(e) => updateLora(index, 'path', e.target.value)}
                    placeholder="LoRA path (e.g., style-name)"
                    className="w-full rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/30"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={lora.scale}
                    onChange={(e) => updateLora(index, 'scale', parseFloat(e.target.value) || 0)}
                    placeholder="Scale (0-1)"
                    className="w-full rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/30"
                  />
                </div>
                <button
                  onClick={() => removeLora(index)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addLora}
              className="flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-white transition-colors px-1 py-2"
            >
              <Plus size={16} />
              Add LoRA
            </button>
          </div>
        </div>
      );
    }

    switch (dataType) {
      case 'string':
        if (options && options.length > 0) {
          // Dropdown/Select
          return (
            <div key={type} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <label className="text-xs font-medium text-gray-400">{label}</label>
                {required && <span className="text-[10px] text-red-400">*</span>}
                {isConnected && (
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1"
                    title={`Connected from node: ${sourceNodeId}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 6L4 9L11 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Connected
                  </span>
                )}
                <Info size={12} className="text-gray-600" />
              </div>
              <div className="relative">
                <select
                  value={value || ''}
                  onChange={(e) => !isConnected && handleFieldChange(type, e.target.value || null)}
                  disabled={isConnected}
                  className={`w-full appearance-none rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2 text-sm text-gray-300 outline-none focus:ring-1 focus:ring-purple-500/30 cursor-pointer ${
                    isConnected ? 'opacity-75 cursor-not-allowed border-purple-500/30' : ''
                  }`}
                >
                  <option value="" className="bg-[#1a1b1e] text-gray-500">--</option>
                  {options.map((option) => (
                    <option key={option} value={option} className="bg-[#1a1b1e]">
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              {isConnected && sourceNodeId && (
                <p className="text-[10px] text-gray-500 mt-1">
                  Value from connected node
                </p>
              )}
            </div>
          );
        } else {
          // Text input or textarea
          const isTextarea = type === 'prompt' || type === 'negative_prompt';
          const isPromptField = type === 'prompt';
          const textareaResize = type === 'prompt' ? promptTextareaResize : type === 'negative_prompt' ? negativePromptTextareaResize : null;

          return (
            <div key={type} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <label className="text-xs font-medium text-gray-400">{label}</label>
                {required && <span className="text-[10px] text-red-400">*</span>}
                {isConnected && (
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1"
                    title={`Connected from node: ${sourceNodeId}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 6L4 9L11 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Connected
                  </span>
                )}
                {isPromptField && promptSaved && (
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1 animate-pulse"
                    title="Prompt saved"
                  >
                    <CheckCircle2 size={12} />
                    Saved
                  </span>
                )}
                <Info size={12} className="text-gray-600" />
              </div>
              <div className="relative">
                {isTextarea && textareaResize ? (
                  <textarea
                    ref={textareaResize.ref}
                    value={value || ''}
                    onChange={(e) => {
                      if (!isConnected) handleFieldChange(type, e.target.value);
                      textareaResize.resize();
                    }}
                    placeholder={placeholder}
                    disabled={isConnected}
                    className={`w-full rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/30 min-h-[80px] max-h-[400px] overflow-y-auto resize-none ${
                      isConnected ? 'opacity-75 cursor-not-allowed border-purple-500/30' : ''
                    } ${
                      isPromptField && promptSaved ? 'border-green-500/30' : ''
                    }`}
                  />
                ) : (
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => !isConnected && handleFieldChange(type, e.target.value)}
                    placeholder={placeholder}
                    disabled={isConnected}
                    className={`w-full rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/30 ${
                      isConnected ? 'opacity-75 cursor-not-allowed border-purple-500/30' : ''
                    } ${
                      isPromptField && promptSaved ? 'border-green-500/30' : ''
                    }`}
                  />
                )}
              </div>
              {isConnected && sourceNodeId && (
                <p className="text-[10px] text-gray-500 mt-1">
                  Value from connected node
                </p>
              )}
              {/* Debug view for prompt field */}
              {isPromptField && (
                <div className="mt-2 p-2 rounded bg-[#161719] border border-white/5">
                  <p className="text-[10px] text-gray-500 mb-1">Debug Info:</p>
                  <p className="text-[10px] text-gray-400">
                    Field Value: <span className="text-gray-300">{value || '(empty)'}</span>
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Saved in Node: <span className="text-gray-300">{selectedNode?.data?.panelSettings?.prompt || '(not saved)'}</span>
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Node Content: <span className="text-gray-300">{selectedNode?.data?.content || '(empty)'}</span>
                  </p>
                </div>
              )}
            </div>
          );
        }

      case 'boolean':
        return (
          <div key={type} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              {isConnected && (
                <span 
                  className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1"
                  title={`Connected from node: ${sourceNodeId}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6L4 9L11 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Connected
                </span>
              )}
            </div>
            <label className={`flex items-center gap-2 ${isConnected ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => !isConnected && handleFieldChange(type, e.target.checked)}
                disabled={isConnected}
                className="w-4 h-4 rounded border-white/10 bg-[#1a1b1e] text-purple-500 focus:ring-purple-500/30 disabled:opacity-50"
              />
              <span className="text-xs text-gray-400">{label}</span>
              <Info size={12} className="text-gray-600" />
            </label>
            {isConnected && sourceNodeId && (
              <p className="text-[10px] text-gray-500 mt-1">
                Value from connected node
              </p>
            )}
          </div>
        );

      case 'number':
        if (type === 'runs') {
          return (
            <div key={type} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <label className="text-xs font-medium text-gray-400">{label}</label>
                {isConnected && (
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1"
                    title={`Connected from node: ${sourceNodeId}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 6L4 9L11 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Connected
                  </span>
                )}
                <Info size={12} className="text-gray-600" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => !isConnected && handleFieldChange(type, Math.max(1, (value || 1) - 1))}
                  disabled={isConnected}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1b1e] border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  value={value || 1}
                  onChange={(e) => {
                    if (!isConnected) {
                      const numValue = parseInt(e.target.value) || 1;
                      handleFieldChange(type, Math.max(1, numValue));
                    }
                  }}
                  disabled={isConnected}
                  min="1"
                  className={`w-12 text-center rounded-lg bg-[#1a1b1e] border border-white/5 px-2 py-1 text-sm text-gray-300 outline-none focus:ring-1 focus:ring-purple-500/30 ${
                    isConnected ? 'opacity-75 cursor-not-allowed border-purple-500/30' : ''
                  }`}
                />
                <button
                  onClick={() => !isConnected && handleFieldChange(type, (value || 1) + 1)}
                  disabled={isConnected}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1b1e] border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={14} />
                </button>
              </div>
              {isConnected && sourceNodeId && (
                <p className="text-[10px] text-gray-500 mt-1">
                  Value from connected node
                </p>
              )}
            </div>
          );
        }
        // Handle cfg_scale as a float number input
        if (type === 'cfg_scale') {
          return (
            <div key={type} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <label className="text-xs font-medium text-gray-400">{label}</label>
                {required && <span className="text-[10px] text-red-400">*</span>}
                {isConnected && (
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1"
                    title={`Connected from node: ${sourceNodeId}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 6L4 9L11 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Connected
                  </span>
                )}
                <Info size={12} className="text-gray-600" />
              </div>
              <input
                type="number"
                step="0.1"
                min="0"
                value={value || ''}
                onChange={(e) => {
                  if (!isConnected) {
                    const numValue = parseFloat(e.target.value);
                    if (!isNaN(numValue) && numValue >= 0) {
                      handleFieldChange(type, numValue);
                    } else if (e.target.value === '') {
                      handleFieldChange(type, '');
                    }
                  }
                }}
                disabled={isConnected}
                placeholder={placeholder}
                className={`w-full rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/30 ${
                  isConnected ? 'opacity-75 cursor-not-allowed border-purple-500/30' : ''
                }`}
              />
              {isConnected && sourceNodeId && (
                <p className="text-[10px] text-gray-500 mt-1">
                  Value from connected node
                </p>
              )}
            </div>
          );
        }
        // Handle other number inputs (num_inference_steps, num_frames, frames_per_second, guide_scale, shift)
        return (
          <div key={type} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <label className="text-xs font-medium text-gray-400">{label}</label>
              {required && <span className="text-[10px] text-red-400">*</span>}
              {isConnected && (
                <span 
                  className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1"
                  title={`Connected from node: ${sourceNodeId}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6L4 9L11 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Connected
                </span>
              )}
              <Info size={12} className="text-gray-600" />
            </div>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => {
                if (!isConnected) {
                  const numValue = parseFloat(e.target.value);
                  if (!isNaN(numValue)) {
                    handleFieldChange(type, numValue);
                  } else if (e.target.value === '') {
                    handleFieldChange(type, '');
                  }
                }
              }}
              disabled={isConnected}
              placeholder={placeholder}
              className={`w-full rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/30 ${
                isConnected ? 'opacity-75 cursor-not-allowed border-purple-500/30' : ''
              }`}
            />
            {isConnected && sourceNodeId && (
              <p className="text-[10px] text-gray-500 mt-1">
                Value from connected node
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Special render for seed field (has random checkbox)
  const renderSeedField = () => {
    const seedConfig = fieldConfigs.find(f => f.type === 'seed');
    if (!seedConfig) return null;

    return (
      <div key="seed" className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-xs font-medium text-gray-400">{seedConfig.label}</label>
          <Info size={12} className="text-gray-600" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={fieldValues.seedRandom}
              onChange={(e) => handleSeedRandomChange(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-[#1a1b1e] text-purple-500 focus:ring-purple-500/30"
            />
            <span className="text-xs text-gray-400">Random</span>
          </label>
        </div>
        <input
          type="text"
          value={fieldValues.seed || ''}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              handleFieldChange('seed', e.target.value);
            }
          }}
          disabled={fieldValues.seedRandom}
          className="w-full rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter seed"
        />
      </div>
    );
  };

  return (
    <aside className="absolute right-0 top-0 z-20 flex h-full w-[360px] flex-col border-l border-white/5 bg-[#0e0e11]">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-white/5 px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-[#1a1b1e] px-4 py-2 text-xs font-medium text-gray-400">
            <Sparkles size={14} className="text-yellow-500" />
            <span>150 credits</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
        {/* Node Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <span className="text-sm font-bold text-white">{selectedNode.data.label}</span>
            <span className="text-xs font-medium text-gray-500">• {nodeCost} credits</span>
          </div>
        </div>

        {/* Connected Images Section for Nano Banana Pro and Nano Banana Pro Edit */}
        {(selectedNode?.type === 'nano_banana_pro' || selectedNode?.type === 'nano_banana_pro_edit') && (
          <div className="mb-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <label className="text-xs font-medium text-gray-400">Connected Images</label>
              <Info size={12} className="text-gray-600" />
            </div>
            {connectedImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {connectedImages.map((img, index) => (
                  <div 
                    key={`${img.sourceNodeId}-${img.portIndex}`} 
                    className="relative group rounded-lg overflow-hidden border border-white/5 bg-[#161719]"
                  >
                    <div className="aspect-square relative">
                      <img 
                        src={img.url} 
                        alt={`Input ${img.portIndex}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-2">
                      <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">
                        IMAGE {img.portIndex}
                      </div>
                      <div className="text-xs font-medium text-gray-300 truncate" title={img.sourceNodeLabel}>
                        {img.sourceNodeLabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic py-4 text-center">
                No images connected. Connect Image, Import, or File nodes to IMAGE ports.
              </div>
            )}
          </div>
        )}

        {/* Dynamically render fields based on node configuration */}
        {fieldConfigs.map((fieldConfig) => {
          // Skip seed - it's rendered separately with special handling
          // Skip runs - removed from UI
          if (fieldConfig.type === 'seed' || fieldConfig.type === 'runs') {
            return null;
          }
          return renderField(fieldConfig);
        })}

        {/* Seed field with special random checkbox */}
        {fieldConfigs.some(f => f.type === 'seed') && renderSeedField()}
      </div>
    </aside>
  );
};

