
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const ChannelsNode: React.FC = () => {
  const [channel, setChannel] = useState('Red');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const channels = ['Red', 'Green', 'Blue', 'Alpha'];

  return (
    <div className="flex flex-col gap-4">
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
      
      <div className="px-1">
        <div className="relative w-[110px]">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-full items-center justify-between rounded-lg bg-[#161719] border border-white/5 px-3 py-2 text-[13px] text-gray-300 hover:border-white/10 transition-colors"
          >
            {channel}
            <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-1 z-50 w-full overflow-hidden rounded-xl border border-white/10 bg-[#1a1b1e] shadow-2xl">
              {channels.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setChannel(opt);
                    setIsDropdownOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {opt}
                  {channel === opt && <div className="h-1.5 w-1.5 rounded-full bg-white/40" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
