
import React, { useState } from 'react';

export const ToggleNode: React.FC = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-4 select-none">
        <span className={`text-[12px] font-bold transition-colors ${!enabled ? 'text-gray-300' : 'text-gray-600'}`}>False</span>
        <button 
          onClick={() => setEnabled(!enabled)}
          className={`relative h-6 w-12 rounded-full transition-colors ${enabled ? 'bg-purple-600' : 'bg-[#161719] border border-white/10'}`}
        >
          <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all shadow-md ${enabled ? 'left-7' : 'left-1'}`} />
        </button>
        <span className={`text-[12px] font-bold transition-colors ${enabled ? 'text-gray-300' : 'text-gray-600'}`}>True</span>
      </div>
    </div>
  );
};
