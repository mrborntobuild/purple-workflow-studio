
import React from 'react';
import { Film } from 'lucide-react';

interface VideoModelPlaceholderNodeProps {
  label: string;
}

export const VideoModelPlaceholderNode: React.FC<VideoModelPlaceholderNodeProps> = ({ label }) => {
  return (
    <div className="flex flex-col gap-4 py-4 items-center justify-center border border-dashed border-white/10 rounded-lg bg-black/20 min-h-[120px]">
      <Film size={24} className="text-gray-600 mb-2" />
      <span className="text-[12px] font-medium text-gray-500">{label} Placeholder</span>
      <button className="mt-2 px-4 py-1.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-bold text-gray-400 hover:text-white transition-colors cursor-not-allowed">
        Run Generation
      </button>
    </div>
  );
};
