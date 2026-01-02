
import React from 'react';
import { ChevronDown } from 'lucide-react';

export const ListNode: React.FC = () => {
  return (
    <div className="py-1">
      <div className="relative">
        <button className="flex w-full items-center justify-between rounded-lg bg-[#161719] border border-white/5 px-4 py-3 text-[13px] text-gray-400 hover:border-white/10 transition-colors">
          No options available
          <ChevronDown size={14} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};
