
import React from 'react';

export const VideoFrameNode: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
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
      />

      <div className="flex items-center gap-6 px-1">
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-gray-500">Frame</span>
          <input 
            type="text" 
            defaultValue="0" 
            className="w-16 rounded-md bg-[#161719] border border-white/5 py-1.5 px-3 text-[12px] text-gray-300 font-mono font-bold outline-none" 
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-gray-500">Timecode</span>
          <span className="text-[12px] text-gray-600 font-mono font-bold">00:00:00</span>
        </div>
      </div>
    </div>
  );
};
