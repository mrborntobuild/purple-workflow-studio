
import React from 'react';
import { Link2 } from 'lucide-react';

interface LevelSliderProps {
  label: string;
  low: number;
  mid: number;
  high: number;
}

const LevelSlider: React.FC<LevelSliderProps> = ({ label, low, mid, high }) => {
  return (
    <div className="flex items-center gap-4 py-1">
      <span className="w-4 text-[13px] font-bold text-gray-500">{label}</span>
      <div className="relative flex flex-1 flex-col gap-2">
        {/* Slider Track */}
        <div className="relative h-px w-full bg-white/10 my-2">
          {/* Slider Handles as dots */}
          <div className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-gray-600" />
          <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-gray-400" />
          <div className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full border border-white/20 bg-white" />
        </div>
        {/* Numeric Inputs */}
        <div className="flex items-center justify-between gap-2">
          <input 
            type="text" 
            readOnly 
            value={low} 
            className="w-14 rounded-md bg-[#161719] border border-white/5 py-1 px-2 text-center text-[12px] text-gray-300 font-mono outline-none" 
          />
          <input 
            type="text" 
            readOnly 
            value={mid.toFixed(2)} 
            className="w-14 rounded-md bg-[#161719] border border-white/5 py-1 px-2 text-center text-[12px] text-gray-300 font-mono outline-none" 
          />
          <input 
            type="text" 
            readOnly 
            value={high} 
            className="w-14 rounded-md bg-[#161719] border border-white/5 py-1 px-2 text-center text-[12px] text-gray-300 font-mono outline-none" 
          />
        </div>
      </div>
    </div>
  );
};

export const LevelsNode: React.FC = () => {
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
        <div className="flex h-full w-full items-center justify-center bg-black/40">
          <span className="text-[12px] font-medium text-gray-600">No data</span>
        </div>
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
          <LevelSlider label="R" low={0} mid={1.0} high={255} />
          <LevelSlider label="G" low={0} mid={1.0} high={255} />
          <LevelSlider label="B" low={0} mid={1.0} high={255} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-2">
        <button className="text-[12px] font-medium text-gray-500 hover:text-white transition-colors">
          Reset
        </button>
      </div>
    </div>
  );
};
