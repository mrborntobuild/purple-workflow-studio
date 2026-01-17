
import React, { useState, useEffect } from 'react';
import { Paintbrush, Eraser, Link2 } from 'lucide-react';
import { applyPainter } from '../../utils/imageProcessing';

interface PainterNodeProps {
  inputImageUrl?: string;
  onUpdate: (data: any) => void;
}

export const PainterNode: React.FC<PainterNodeProps> = ({ inputImageUrl, onUpdate }) => {
  const [activeTool, setActiveTool] = useState<'brush' | 'eraser'>('brush');
  const [intensity, setIntensity] = useState(0.5);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Process image when input or intensity changes
  useEffect(() => {
    if (inputImageUrl) {
      setIsProcessing(true);
      applyPainter(inputImageUrl, intensity)
        .then((url) => {
          setProcessedImageUrl(url);
          onUpdate({ imageUrl: url });
          setIsProcessing(false);
        })
        .catch((err) => {
          setIsProcessing(false);
        });
    } else {
      setProcessedImageUrl(null);
    }
  }, [inputImageUrl, intensity, onUpdate]);

  const displayImage = processedImageUrl || inputImageUrl;

  return (
    <div className="flex flex-col gap-4">
      {/* Drawing Canvas Area */}
      <div className="relative aspect-square w-full rounded-lg bg-black border border-white/5 overflow-hidden shadow-inner">
        {displayImage ? (
          <>
            <img 
              src={displayImage} 
              alt="Painter preview" 
              className="h-full w-full object-contain"
              style={{ opacity: isProcessing ? 0.6 : 1 }}
            />
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="text-[11px] text-gray-400">Processing...</span>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Paintbrush size={48} className="text-white/[0.02]" strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Tools & Settings Section */}
      <div className="flex flex-col gap-4 px-1">
        {/* Tool Selector Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setActiveTool('brush')}
              className={`p-2 rounded-lg transition-all ${activeTool === 'brush' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Paintbrush size={18} />
            </button>
            <button 
              onClick={() => setActiveTool('eraser')}
              className={`p-2 rounded-lg transition-all ${activeTool === 'eraser' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Eraser size={18} />
            </button>
          </div>
          <button className="text-[12px] font-medium text-gray-500 hover:text-white transition-colors">
            Clear
          </button>
        </div>

        {/* Brush Properties Row */}
        <div className="flex items-center gap-3">
          {/* Color Picker */}
          <div className="flex items-center gap-2 rounded-lg bg-[#161719] border border-white/5 p-1 pr-3">
            <div className="h-6 w-6 rounded-md bg-white shadow-sm" />
            <span className="text-[11px] font-mono text-gray-400 font-bold tracking-tight uppercase">FFFFFF</span>
          </div>

          {/* Opacity */}
          <div className="rounded-lg bg-[#161719] border border-white/5 px-2.5 py-1.5">
            <span className="text-[11px] font-bold text-gray-300">100%</span>
          </div>

          {/* Intensity Slider */}
          <div className="flex flex-1 items-center gap-3 pl-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">Intensity</span>
            <div className="relative h-px flex-1 bg-white/10">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={intensity} 
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-white border border-gray-900 shadow-md pointer-events-none" 
                style={{ left: `${intensity * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-gray-400 w-8 text-right">{Math.round(intensity * 100)}</span>
          </div>
        </div>

        {/* Canvas Settings Row */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-[#161719] border border-white/5 px-2 py-1.5 gap-2">
              <span className="text-[10px] font-bold text-gray-600">W</span>
              <span className="text-[11px] font-mono font-bold text-gray-300">1024</span>
            </div>
            <div className="flex items-center rounded-lg bg-[#161719] border border-white/5 px-2 py-1.5 gap-2">
              <span className="text-[10px] font-bold text-gray-600">H</span>
              <span className="text-[11px] font-mono font-bold text-gray-300">1024</span>
            </div>
            <button className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors">
              <Link2 size={14} className="rotate-45" />
            </button>
          </div>

          <div className="flex items-center gap-3">
             <span className="text-[11px] font-medium text-gray-500">Background Color</span>
             <div className="h-6 w-6 rounded-md bg-black border border-white/10 shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
