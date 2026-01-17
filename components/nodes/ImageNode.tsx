
import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Image as ImageIcon, Plus, ArrowRight, Play, X } from 'lucide-react';
import { nanoBananaProService } from '../../services/nanoBananaProEditService';
import { Edge, CanvasNode } from '../../types';
import { LazyImage } from './LazyImage';
import { ImageModal } from './ImageModal';

export interface ImageNodeRef {
  openModal: () => void;
}

interface ImageNodeProps {
  imageUrl?: string;
  content: string;
  status?: string;
  progress?: number;
  onUpdate: (data: any) => void;
  onRun?: () => void;
  imageInputCount?: number;
  nodeType?: string;
  nodeId?: string;
  edges?: Edge[];
  nodes?: CanvasNode[];
  panelSettings?: {
    prompt?: string;
    aspectRatio?: string;
    outputFormat?: string;
    resolution?: string;
    negativePrompt?: string;
    seed?: string;
    seedRandom?: boolean;
    syncMode?: boolean;
    limitGenerations?: boolean;
    enableWebSearch?: boolean;
  };
}

const ImageNodeComponent = forwardRef(
  function ImageNodeComponent({ 
    imageUrl, 
    content, 
    status, 
    progress, 
    onUpdate, 
    onRun, 
    imageInputCount = 0, 
    nodeType,
    nodeId,
    edges = [],
    nodes = [],
    panelSettings
  }: ImageNodeProps, ref: React.ForwardedRef<ImageNodeRef>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Expose modal open function via ref
  useImperativeHandle(ref, () => ({
    openModal: () => {
      if (imageUrl && status !== 'loading') {
        setIsModalOpen(true);
      }
    }
  }), [imageUrl, status]);
  
  // nano_banana_pro can have up to 4 image ports total (imageInputCount = 0-4)
  // nano_banana_pro_edit always has 1 base image port, can add up to 3 more (imageInputCount = 0-3, total 1-4)
  // flux_pro_1_1, flux_dev, flux_lora, imagen_3, imagen_3_fast, and minimax_image have 0 (no image inputs)
  // others can have 1
  const isNanoBananaProEdit = nodeType === 'nano_banana_pro_edit';
  const maxImagePorts = nodeType === 'nano_banana_pro' ? 4 : isNanoBananaProEdit ? 3 : (nodeType === 'flux_pro_1_1' || nodeType === 'flux_dev' || nodeType === 'flux_lora' || nodeType === 'imagen_3' || nodeType === 'imagen_3_fast' || nodeType === 'minimax_image') ? 0 : 1;
  const currentCount = imageInputCount || 0;
  // For nano_banana_pro_edit, imageInputCount represents additional ports beyond the base one
  // So we check if we can add more (currentCount < 3 means we can add up to 3 more)
  const canAddMore = maxImagePorts > 0 && currentCount < maxImagePorts;
  // For nano_banana_pro_edit, hasPorts is always true (base port exists), but we show the remove button if there are additional ports
  const hasPorts = isNanoBananaProEdit ? currentCount > 0 : currentCount > 0;

  const handleAddImageInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canAddMore) {
      const newCount = currentCount + 1;
      onUpdate({ 
        panelSettings: { 
          imageInputCount: newCount 
        } 
      });
    }
  };

  const handleRemoveImageInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeType === 'nano_banana_pro') {
      // For nano_banana_pro, decrement by 1 (can go to 0)
      const newCount = Math.max(0, currentCount - 1);
      onUpdate({ 
        panelSettings: { 
          imageInputCount: newCount 
        } 
      });
    } else if (nodeType === 'nano_banana_pro_edit') {
      // For nano_banana_pro_edit, decrement by 1 (but can't go below 0, base port always exists)
      // imageInputCount represents additional ports beyond the base one
      const newCount = Math.max(0, currentCount - 1);
      onUpdate({ 
        panelSettings: { 
          imageInputCount: newCount 
        } 
      });
    } else {
      // For others, remove all at once
      onUpdate({ 
        panelSettings: { 
          imageInputCount: 0 
        } 
      });
    }
  };

  // Get input images from connected edges
  const getInputImages = (): string[] => {
    if (!nodeId || !edges || !nodes) return [];
    
    const inputEdges = edges.filter(e => e.target === nodeId && e.targetPortIndex > 0);
    const imageUrls: string[] = [];
    
    for (const edge of inputEdges) {
      const sourceNode = nodes.find(n => n.id === edge.source);
      if (sourceNode?.data.imageUrl) {
        imageUrls.push(sourceNode.data.imageUrl);
      }
    }
    
    return imageUrls;
  };

  // Get prompt from panelSettings, content, or connected node
  const getPrompt = (): string => {
    // Priority: panelSettings.prompt > content > connected prompt node
    if (panelSettings?.prompt) {
      return panelSettings.prompt;
    }
    if (content) {
      return content;
    }
    // Check connected prompt (port 0)
    if (nodeId && edges && nodes) {
      const promptEdge = edges.find(e => e.target === nodeId && e.targetPortIndex === 0);
      if (promptEdge) {
        const sourceNode = nodes.find(n => n.id === promptEdge.source);
        if (sourceNode?.data.content) {
          return sourceNode.data.content;
        }
      }
    }
    return '';
  };

  const pollingIntervalRef = useRef<number | null>(null);
  const usedModelRef = useRef<string | null>(null);

  // Handle run for Nano Banana Pro (both base and edit) using fal.ai service directly
  const handleNanoBananaProRun = async () => {
    if (status === 'loading') return;

    const inputImages = getInputImages();
    
    // nano_banana_pro_edit always requires images
    if (nodeType === 'nano_banana_pro_edit' && inputImages.length === 0) {
      alert('Nano Banana Pro Edit requires at least one input image');
      return;
    }

    const prompt = getPrompt();
    
    onUpdate({ 
      status: 'loading',
      progress: 0
    });

    try {
      // Start generation using fal.ai service directly
      const { requestId, usedModel } = await nanoBananaProService.startGeneration({
        prompt,
        modelType: nodeType as 'nano_banana_pro' | 'nano_banana_pro_edit',
        imageUrls: inputImages.length > 0 ? inputImages : undefined,
        aspectRatio: panelSettings?.aspectRatio,
        outputFormat: panelSettings?.outputFormat,
        resolution: panelSettings?.resolution,
        negativePrompt: panelSettings?.negativePrompt,
        seed: panelSettings?.seed,
        seedRandom: panelSettings?.seedRandom,
        syncMode: panelSettings?.syncMode,
        limitGenerations: panelSettings?.limitGenerations,
        enableWebSearch: panelSettings?.enableWebSearch,
      });

      // Store request ID and model used
      usedModelRef.current = usedModel;
      onUpdate({ jobId: requestId, usedModel });

      // Start polling for status
      const pollStatus = async () => {
        try {
          const statusResponse = await nanoBananaProService.getStatus(requestId, usedModel);
          
          // Stop polling when COMPLETED (regardless of imageUrl to avoid infinite polling)
          if (statusResponse.status === 'COMPLETED') {
            // Stop polling
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            
            // Update with result if image URL is available
            if (statusResponse.imageUrl) {
              onUpdate({
                imageUrl: statusResponse.imageUrl,
                status: 'success',
                progress: undefined,
              });
            } else {
              // Completed but no image URL - show error
              onUpdate({ status: 'error' });
            }
          } else if (statusResponse.status === 'FAILED') {
            // Stop polling
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            
            onUpdate({ status: 'error' });
          } else {
            // Update progress and continue polling
            onUpdate({
              progress: statusResponse.progress || 0,
              status: 'loading',
            });
            
            // Continue polling
            pollingIntervalRef.current = window.setTimeout(pollStatus, 2500);
          }
        } catch (error) {
          console.error('Error polling status:', error);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          onUpdate({ status: 'error' });
        }
      };

      // Start polling immediately, then every 2.5 seconds
      pollStatus();
    } catch (error) {
      console.error('Error starting generation:', error);
      onUpdate({ status: 'error' });
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Handle image click to open modal (only when image is generated and not loading)
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageUrl && status !== 'loading') {
      setIsModalOpen(true);
    }
  };

  // Use fal.ai service for both nano_banana_pro and nano_banana_pro_edit, otherwise use onRun callback (which goes through n8n)
  const handleRun = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeType === 'nano_banana_pro' || nodeType === 'nano_banana_pro_edit') {
      handleNanoBananaProRun();
    } else if (onRun) {
      onRun();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Large Checkerboard Preview Area */}
        <div 
          className={`relative aspect-square w-full rounded-lg overflow-hidden border border-white/5 shadow-inner ${
            imageUrl && status !== 'loading' ? 'cursor-pointer' : ''
          }`}
          onClick={handleImageClick}
          style={{
            backgroundColor: '#1a1b1e',
            backgroundImage: `
              linear-gradient(45deg, #25262b 25%, transparent 25%),
              linear-gradient(-45deg, #25262b 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #25262b 75%),
              linear-gradient(-45deg, transparent 75%, #25262b 75%)
            `,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px'
          }}
        >
        {imageUrl ? (
          <>
            <LazyImage
              src={imageUrl}
              alt="Generated image"
              className="h-full w-full object-contain select-none"
              draggable={false}
              style={{ opacity: status === 'loading' ? 0.6 : 1 }}
            />
            {status === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                {/* Rotating Purple Spinner */}
                <div className="relative mb-4">
                  <div className="w-12 h-12 border-4 border-purple-500/20 rounded-full"></div>
                  <div 
                    className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
                    style={{ animationDuration: '1s' }}
                  ></div>
                </div>
                
                {progress !== undefined && (
                  <>
                    <div className="w-3/4 h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-400">
                      Generating... {progress}%
                    </span>
                  </>
                )}
                {progress === undefined && (
                  <span className="text-[11px] text-gray-400">Generating...</span>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {status === 'loading' ? (
              <div className="flex h-full w-full flex-col items-center justify-center bg-black/20">
                {/* Rotating Purple Spinner */}
                <div className="relative mb-4">
                  <div className="w-12 h-12 border-4 border-purple-500/20 rounded-full"></div>
                  <div 
                    className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
                    style={{ animationDuration: '1s' }}
                  ></div>
                </div>
                {progress !== undefined && (
                  <>
                    <div className="w-3/4 h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-400">
                      Generating... {progress}%
                    </span>
                  </>
                )}
                {progress === undefined && (
                  <span className="text-[11px] text-gray-400">Generating...</span>
                )}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black/20">
                <ImageIcon size={48} className="text-white/[0.03]" strokeWidth={1} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col gap-3 mt-auto">
        {canAddMore && (
          <button 
            className="flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-white transition-colors"
            onClick={handleAddImageInput}
          >
            <Plus size={16} />
            Add another image input
          </button>
        )}
        {hasPorts && (
          <button 
            className="flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-white transition-colors"
            onClick={handleRemoveImageInput}
          >
            <X size={16} />
            {nodeType === 'nano_banana_pro' ? 'Remove image input' : 'Remove image input'}
          </button>
        )}
        
        {(onRun || nodeType === 'nano_banana_pro_edit') && (
          <button 
            onClick={handleRun}
            disabled={status === 'loading'}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 px-6 py-2.5 text-[13px] font-bold text-gray-200 transition-all active:scale-95 disabled:opacity-50 shadow-lg w-full"
          >
            {status === 'loading' ? 'Generating...' : (
              <>
                <Play size={14} className="fill-current" />
                Run Model
              </>
            )}
          </button>
        )}
      </div>
      </div>

      <ImageModal
        imageUrl={imageUrl || ''}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
  }
);

ImageNodeComponent.displayName = 'ImageNode';

export const ImageNode = ImageNodeComponent as React.ForwardRefExoticComponent<ImageNodeProps & React.RefAttributes<ImageNodeRef>>;
