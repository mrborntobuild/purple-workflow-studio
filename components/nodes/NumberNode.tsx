
import React, { useState } from 'react';

export const NumberNode: React.FC = () => {
  const [value, setValue] = useState("0");
  const [useDecimals, setUseDecimals] = useState(false);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg bg-[#161719] border border-white/5 px-4 py-3">
        <input 
          type="text" 
          value={value} 
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent text-[14px] font-mono font-bold text-gray-200 outline-none" 
        />
      </div>

      <div className="flex items-center gap-2.5 px-1">
        <button 
          onClick={() => setUseDecimals(!useDecimals)}
          className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${useDecimals ? 'bg-purple-600 border-purple-500' : 'bg-transparent border-white/10'}`}
        >
          {useDecimals && <div className="h-2 w-2 rounded-full bg-white" />}
        </button>
        <span className="text-[12px] text-gray-400">Use decimals (float)</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 px-1">
          <span className="text-[11px] font-mono font-bold text-gray-600 uppercase">Min</span>
          <div className="rounded-lg bg-[#161719] border border-white/5 px-3 py-2">
            <input 
              type="text" 
              value={min} 
              onChange={(e) => setMin(e.target.value)}
              className="w-full bg-transparent text-[13px] font-mono text-gray-300 outline-none" 
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 px-1">
          <span className="text-[11px] font-mono font-bold text-gray-600 uppercase">Max</span>
          <div className="rounded-lg bg-[#161719] border border-white/5 px-3 py-2">
            <input 
              type="text" 
              value={max} 
              onChange={(e) => setMax(e.target.value)}
              className="w-full bg-transparent text-[13px] font-mono text-gray-300 outline-none" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
