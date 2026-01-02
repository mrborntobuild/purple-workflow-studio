
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const BlurNode: React.FC = () => {
  const [blurType, setBlurType] = useState('Box');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [size, setSize] = useState(3);

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
        <div className="flex h-full w-full items-center justify-center bg-black/10 backdrop-blur-[2px]">
           {/* Hint of blur in the preview */}
        </div>
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
              {blurType}
              <ChevronDown size={12} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-1 z-50 w-full overflow-hidden rounded-lg border border-white/10 bg-[#1a1b1e] shadow-2xl">
                {['Box', 'Gaussian'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setBlurType(opt);
                      setIsDropdownOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-[12px] text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {opt}
                    {blurType === opt && <div className="h-1.5 w-1.5 rounded-full bg-white/40" />}
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
              max="100" 
              value={size} 
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-white shadow-lg pointer-events-none" 
              style={{ left: `${size}%` }}
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
