
import React, { useState } from 'react';
import { Link2, ChevronDown } from 'lucide-react';

export const CropNode: React.FC = () => {
  const [aspectRatio, setAspectRatio] = useState('Custom');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const options = ['1:1', '3:4', '4:3', '16:9', '9:16', 'Custom'];

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
        {/* Crop overlay would be here in a real implementation */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="h-3/4 w-3/4 border-2 border-white/20 border-dashed rounded-sm" />
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col gap-4 px-1">
        
        {/* Aspect Ratio Row */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[12px] font-medium text-gray-500 whitespace-nowrap">Aspect ratio</span>
          
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg bg-[#161719] border border-white/5 px-3 py-2 text-[13px] text-gray-300 hover:border-white/10 transition-colors"
              >
                {aspectRatio}
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-1 z-50 w-full overflow-hidden rounded-xl border border-white/10 bg-[#1a1b1e] shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                  {options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setAspectRatio(opt);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-[13px] text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button className="text-[12px] font-medium text-gray-500 hover:text-white transition-colors">
              Reset
            </button>
          </div>
        </div>

        {/* Dimensions Row */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[12px] font-medium text-gray-500 whitespace-nowrap">Dimensions</span>
          
          <div className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 items-center rounded-lg bg-[#161719] border border-white/5 px-2.5 py-2 gap-2">
              <span className="text-[10px] font-bold text-gray-600">W</span>
              <input 
                type="text" 
                defaultValue="1024" 
                className="w-full bg-transparent text-[12px] font-mono font-bold text-gray-300 outline-none" 
              />
            </div>
            <div className="flex flex-1 items-center rounded-lg bg-[#161719] border border-white/5 px-2.5 py-2 gap-2">
              <span className="text-[10px] font-bold text-gray-600">H</span>
              <input 
                type="text" 
                defaultValue="1024" 
                className="w-full bg-transparent text-[12px] font-mono font-bold text-gray-300 outline-none" 
              />
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-[#161719] text-gray-500 hover:text-gray-300 transition-colors">
              <Link2 size={14} className="rotate-45" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
