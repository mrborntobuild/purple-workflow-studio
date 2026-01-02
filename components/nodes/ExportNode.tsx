
import React from 'react';
import { Download } from 'lucide-react';

export const ExportNode: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-2 min-h-[80px]">
      <button className="group/btn flex w-full items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] py-8 text-gray-600 hover:bg-white/[0.04] hover:text-white transition-all active:scale-[0.98]">
        <Download size={28} strokeWidth={1.5} className="group-hover/btn:scale-110 transition-transform" />
      </button>
    </div>
  );
};
