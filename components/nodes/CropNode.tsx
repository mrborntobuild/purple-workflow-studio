
import React, { useState, useEffect } from 'react';
import { Link2, ChevronDown } from 'lucide-react';
import { applyCrop } from '../../utils/imageProcessing';

interface CropNodeProps {
  inputImageUrl?: string;
  onUpdate: (data: any) => void;
}

export const CropNode: React.FC<CropNodeProps> = ({ inputImageUrl, onUpdate }) => {
  const [aspectRatio, setAspectRatio] = useState('Custom');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isLinked, setIsLinked] = useState(false);

  const options = ['1:1', '3:4', '4:3', '16:9', '9:16', 'Custom'];

  // Load image to get dimensions
  useEffect(() => {
    if (inputImageUrl) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        if (aspectRatio === 'Custom') {
          setWidth(img.width);
          setHeight(img.height);
        }
      };
      img.src = inputImageUrl;
    }
  }, [inputImageUrl]);

  // Update height when aspect ratio changes
  useEffect(() => {
    if (aspectRatio !== 'Custom' && imageDimensions && width > 0) {
      const [w, h] = aspectRatio.split(':').map(Number);
      const ratio = w / h;
      const newHeight = Math.round(width / ratio);
      setHeight(newHeight);
    }
  }, [aspectRatio, width, imageDimensions]);

  // Handle linked dimensions
  useEffect(() => {
    if (isLinked && imageDimensions && width > 0) {
      const ratio = imageDimensions.width / imageDimensions.height;
      setHeight(Math.round(width / ratio));
    }
  }, [width, isLinked, imageDimensions]);

  // Process crop
  useEffect(() => {
    if (inputImageUrl && imageDimensions && width > 0 && height > 0) {
      setIsProcessing(true);
      // Crop from center
      const x = Math.max(0, (imageDimensions.width - width) / 2);
      const y = Math.max(0, (imageDimensions.height - height) / 2);
      const cropWidth = Math.min(width, imageDimensions.width - x);
      const cropHeight = Math.min(height, imageDimensions.height - y);
      
      applyCrop(inputImageUrl, x, y, cropWidth, cropHeight)
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
  }, [inputImageUrl, width, height, imageDimensions, onUpdate]);

  const handleReset = () => {
    if (imageDimensions) {
      setWidth(imageDimensions.width);
      setHeight(imageDimensions.height);
      setAspectRatio('Custom');
      setIsLinked(false);
    }
  };

  const displayImage = processedImageUrl || inputImageUrl;

  return (
    <div className="flex flex-col gap-3">
      {/* Checkerboard Preview Area - Smaller */}
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
              alt="Crop preview" 
              className="h-full w-full object-contain"
              style={{ opacity: isProcessing ? 0.6 : 1 }}
            />
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="text-[10px] text-gray-400">Processing...</span>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="h-3/4 w-3/4 border-2 border-white/20 border-dashed rounded-sm" />
          </div>
        )}
      </div>

      {/* Controls Section - Compact */}
      <div className="flex flex-col gap-2.5 px-1">
        {/* Aspect Ratio Row */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-gray-500 whitespace-nowrap">Aspect ratio</span>
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg bg-[#161719] border border-white/5 px-2.5 py-1.5 text-[12px] text-gray-300 hover:border-white/10 transition-colors"
              >
                {aspectRatio}
                <ChevronDown size={12} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-1 z-50 w-full overflow-hidden rounded-xl border border-white/10 bg-[#1a1b1e] shadow-2xl">
                  {options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setAspectRatio(opt);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-[12px] text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={handleReset}
              className="text-[11px] font-medium text-gray-500 hover:text-white transition-colors whitespace-nowrap"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Dimensions Row */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-gray-500 whitespace-nowrap">Dimensions</span>
          <div className="flex flex-1 items-center gap-1.5">
            <div className="flex flex-1 items-center rounded-lg bg-[#161719] border border-white/5 px-2 py-1.5 gap-1.5">
              <span className="text-[9px] font-bold text-gray-600">W</span>
              <input 
                type="number" 
                min="1"
                value={width} 
                onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                className="w-full bg-transparent text-[11px] font-mono font-bold text-gray-300 outline-none focus:border-white/20" 
              />
            </div>
            <div className="flex flex-1 items-center rounded-lg bg-[#161719] border border-white/5 px-2 py-1.5 gap-1.5">
              <span className="text-[9px] font-bold text-gray-600">H</span>
              <input 
                type="number" 
                min="1"
                value={height} 
                onChange={(e) => setHeight(parseInt(e.target.value) || 1)}
                className="w-full bg-transparent text-[11px] font-mono font-bold text-gray-300 outline-none focus:border-white/20" 
              />
            </div>
            <button 
              onClick={() => setIsLinked(!isLinked)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-[#161719] transition-colors ${
                isLinked ? 'text-white bg-white/10' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Link2 size={12} className={isLinked ? '' : 'rotate-45'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
