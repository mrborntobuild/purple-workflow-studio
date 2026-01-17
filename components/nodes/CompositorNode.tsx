
import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, ChevronDown } from 'lucide-react';
import { applyCompositor } from '../../utils/imageProcessing';

interface CompositorNodeProps {
  inputImageUrl?: string;
  overlayImageUrl?: string;
  onUpdate: (data: any) => void;
}

export const CompositorNode: React.FC<CompositorNodeProps> = ({ inputImageUrl, overlayImageUrl, onUpdate }) => {
  const [blendMode, setBlendMode] = useState<'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light'>('normal');
  const [opacity, setOpacity] = useState(1.0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const blendModes: Array<'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light'> = [
    'normal', 'multiply', 'screen', 'overlay', 'soft-light'
  ];

  useEffect(() => {
    if (inputImageUrl && overlayImageUrl) {
      setIsProcessing(true);
      applyCompositor(inputImageUrl, overlayImageUrl, blendMode, opacity)
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
  }, [inputImageUrl, overlayImageUrl, blendMode, opacity, onUpdate]);

  const displayImage = processedImageUrl || inputImageUrl;

  return (
    <div className="flex flex-col gap-5">
      {/* Large Checkerboard Preview Area */}
      <div 
        className="relative aspect-square w-full rounded-lg overflow-hidden border border-white/5 shadow-inner"
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
        {displayImage ? (
          <>
            <img 
              src={displayImage} 
              alt="Compositor preview" 
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
          <div className="flex h-full w-full items-center justify-center bg-black/20">
            <ImageIcon size={48} className="text-white/[0.03]" strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 px-1">
        {/* Blend Mode */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[12px] font-medium text-gray-500 whitespace-nowrap">Blend mode</span>
          <div className="relative flex-1">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex w-full items-center justify-between rounded-lg bg-[#161719] border border-white/5 px-3 py-2 text-[13px] text-gray-300 hover:border-white/10 transition-colors"
            >
              {blendMode.charAt(0).toUpperCase() + blendMode.slice(1)}
              <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-1 z-50 w-full overflow-hidden rounded-xl border border-white/10 bg-[#1a1b1e] shadow-2xl">
                {blendModes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setBlendMode(mode);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-[13px] text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    {blendMode === mode && <div className="h-1.5 w-1.5 rounded-full bg-white/40 float-right mt-1.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Opacity */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-gray-500 whitespace-nowrap">Opacity</span>
          <div className="relative flex-1 h-px bg-white/10">
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="1"
              value={opacity * 100} 
              onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-white shadow-lg pointer-events-none" 
              style={{ left: `${opacity * 100}%` }}
            />
          </div>
          <div className="rounded-lg bg-[#161719] border border-white/5 px-2 py-1 min-w-[40px] text-center">
            <span className="text-[11px] font-mono font-bold text-gray-300">{Math.round(opacity * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
