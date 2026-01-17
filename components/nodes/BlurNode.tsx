
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { applyBlur } from '../../utils/imageProcessing';

interface BlurNodeProps {
  inputImageUrl?: string;
  onUpdate: (data: any) => void;
}

export const BlurNode: React.FC<BlurNodeProps> = ({ inputImageUrl, onUpdate }) => {
  const [blurType, setBlurType] = useState<'box' | 'gaussian'>('gaussian');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [size, setSize] = useState(3);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Process image whenever input or settings change
  useEffect(() => {
    if (inputImageUrl) {
      setIsProcessing(true);
      applyBlur(inputImageUrl, size, blurType)
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
  }, [inputImageUrl, size, blurType, onUpdate]);

  const displayImage = processedImageUrl || inputImageUrl;

  return (
    <div className="flex flex-col gap-5">
      {/* Checkerboard Preview Area */}
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
              alt="Blur preview" 
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
          <div className="flex h-full w-full items-center justify-center bg-black/10">
            <span className="text-[12px] font-medium text-gray-600">Connect an image</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 px-1">
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-gray-500 whitespace-nowrap">Type</span>
          <div className="relative min-w-[90px]">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex w-full items-center justify-between rounded-lg bg-[#161719] border border-white/5 px-2.5 py-1.5 text-[12px] text-gray-300 hover:border-white/10 transition-colors"
            >
              {blurType === 'gaussian' ? 'Gaussian' : 'Box'}
              <ChevronDown size={12} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-1 z-50 w-full overflow-hidden rounded-lg border border-white/10 bg-[#1a1b1e] shadow-2xl">
                {(['Box', 'Gaussian'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setBlurType(opt.toLowerCase() as 'box' | 'gaussian');
                      setIsDropdownOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-[12px] text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {opt}
                    {blurType === opt.toLowerCase() && <div className="h-1.5 w-1.5 rounded-full bg-white/40" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3">
          <span className="text-[12px] font-medium text-gray-500 whitespace-nowrap">Size</span>
          <div className="relative flex-1 h-px bg-white/10">
            <input 
              type="range" 
              min="0" 
              max="50" 
              value={size} 
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-white shadow-lg pointer-events-none" 
              style={{ left: `${(size / 50) * 100}%` }}
            />
          </div>
          <div className="rounded-lg bg-[#161719] border border-white/5 px-2 py-1 min-w-[32px] text-center">
            <span className="text-[11px] font-mono font-bold text-gray-300">{size}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
