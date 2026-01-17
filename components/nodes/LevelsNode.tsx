
import React, { useState, useEffect } from 'react';
import { Link2 } from 'lucide-react';
import { applyLevels } from '../../utils/imageProcessing';

interface LevelSliderProps {
  label: string;
  low: number;
  mid: number;
  high: number;
  onChange: (low: number, mid: number, high: number) => void;
}

const LevelSlider: React.FC<LevelSliderProps> = ({ label, low, mid, high, onChange }) => {
  const handleLowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLow = parseInt(e.target.value) || 0;
    if (newLow >= 0 && newLow < high) {
      onChange(newLow, mid, high);
    }
  };

  const handleMidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMid = parseFloat(e.target.value) || 1.0;
    if (newMid > 0 && newMid <= 5) {
      onChange(low, newMid, high);
    }
  };

  const handleHighChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHigh = parseInt(e.target.value) || 255;
    if (newHigh > low && newHigh <= 255) {
      onChange(low, mid, newHigh);
    }
  };

  return (
    <div className="flex items-center gap-4 py-1">
      <span className="w-4 text-[13px] font-bold text-gray-500">{label}</span>
      <div className="relative flex flex-1 flex-col gap-2">
        <div className="relative h-px w-full bg-white/10 my-2">
          <div 
            className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-white/20 bg-gray-600 cursor-pointer hover:bg-gray-500 transition-colors" 
            style={{ left: `${(low / 255) * 100}%`, transform: 'translate(-50%, -50%)' }}
          />
          <div 
            className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-white/20 bg-gray-400 cursor-pointer hover:bg-gray-300 transition-colors" 
            style={{ left: `${50}%`, transform: 'translate(-50%, -50%)' }}
          />
          <div 
            className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-white/20 bg-white cursor-pointer hover:bg-gray-100 transition-colors" 
            style={{ left: `${(high / 255) * 100}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <input 
            type="number" 
            min="0"
            max="254"
            value={low} 
            onChange={handleLowChange}
            className="w-14 rounded-md bg-[#161719] border border-white/5 py-1 px-2 text-center text-[12px] text-gray-300 font-mono outline-none focus:border-white/20" 
          />
          <input 
            type="number" 
            min="0.1"
            max="5"
            step="0.1"
            value={mid.toFixed(2)} 
            onChange={handleMidChange}
            className="w-14 rounded-md bg-[#161719] border border-white/5 py-1 px-2 text-center text-[12px] text-gray-300 font-mono outline-none focus:border-white/20" 
          />
          <input 
            type="number" 
            min="1"
            max="255"
            value={high} 
            onChange={handleHighChange}
            className="w-14 rounded-md bg-[#161719] border border-white/5 py-1 px-2 text-center text-[12px] text-gray-300 font-mono outline-none focus:border-white/20" 
          />
        </div>
      </div>
    </div>
  );
};

interface LevelsNodeProps {
  inputImageUrl?: string;
  onUpdate: (data: any) => void;
}

export const LevelsNode: React.FC<LevelsNodeProps> = ({ inputImageUrl, onUpdate }) => {
  const [rLow, setRLow] = useState(0);
  const [rMid, setRMid] = useState(1.0);
  const [rHigh, setRHigh] = useState(255);
  const [gLow, setGLow] = useState(0);
  const [gMid, setGMid] = useState(1.0);
  const [gHigh, setGHigh] = useState(255);
  const [bLow, setBLow] = useState(0);
  const [bMid, setBMid] = useState(1.0);
  const [bHigh, setBHigh] = useState(255);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Process image when input or levels change
  useEffect(() => {
    if (inputImageUrl) {
      setIsProcessing(true);
      applyLevels(inputImageUrl, rLow, rMid, rHigh, gLow, gMid, gHigh, bLow, bMid, bHigh)
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
  }, [inputImageUrl, rLow, rMid, rHigh, gLow, gMid, gHigh, bLow, bMid, bHigh, onUpdate]);

  const handleReset = () => {
    setRLow(0); setRMid(1.0); setRHigh(255);
    setGLow(0); setGMid(1.0); setGHigh(255);
    setBLow(0); setBMid(1.0); setBHigh(255);
  };

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
              alt="Levels preview" 
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
          <div className="flex h-full w-full items-center justify-center bg-black/40">
            <span className="text-[12px] font-medium text-gray-600">Connect an image</span>
          </div>
        )}
      </div>

      {/* Control Section */}
      <div className="relative pl-6">
        {/* Linking Line and Icon */}
        <div className="absolute left-0 top-[22px] bottom-[22px] w-4 border-l border-t border-b border-white/10 rounded-l-lg pointer-events-none">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-md border border-white/5 bg-[#1a1b1e] shadow-xl">
            <Link2 size={12} className="text-gray-400 rotate-45" />
          </div>
        </div>

        {/* RGB Channels */}
        <div className="flex flex-col gap-3">
          <LevelSlider 
            label="R" 
            low={rLow} 
            mid={rMid} 
            high={rHigh} 
            onChange={(l, m, h) => { setRLow(l); setRMid(m); setRHigh(h); }} 
          />
          <LevelSlider 
            label="G" 
            low={gLow} 
            mid={gMid} 
            high={gHigh} 
            onChange={(l, m, h) => { setGLow(l); setGMid(m); setGHigh(h); }} 
          />
          <LevelSlider 
            label="B" 
            low={bLow} 
            mid={bMid} 
            high={bHigh} 
            onChange={(l, m, h) => { setBLow(l); setBMid(m); setBHigh(h); }} 
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-2">
        <button 
          onClick={handleReset}
          className="text-[12px] font-medium text-gray-500 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
