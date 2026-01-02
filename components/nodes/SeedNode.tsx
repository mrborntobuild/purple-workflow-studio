
import React, { useState } from 'react';

export const SeedNode: React.FC = () => {
  const [random, setRandom] = useState(false);
  const [seed, setSeed] = useState("1");

  return (
    <div className="flex items-center gap-4 py-1">
      <div className="flex items-center gap-2.5 px-1">
        <button 
          onClick={() => setRandom(!random)}
          className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${random ? 'bg-purple-600 border-purple-500' : 'bg-transparent border-white/10'}`}
        >
          {random && <div className="h-2 w-2 rounded-full bg-white" />}
        </button>
        <span className="text-[12px] text-gray-400">Random</span>
      </div>

      <div className="flex-1 rounded-lg bg-[#161719] border border-white/5 px-4 py-2.5">
        <input 
          type="text" 
          value={seed} 
          onChange={(e) => setSeed(e.target.value)}
          className="w-full bg-transparent text-[13px] font-mono font-bold text-gray-300 outline-none" 
        />
      </div>
    </div>
  );
};
