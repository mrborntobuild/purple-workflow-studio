
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ModulePlaceholderNodeProps {
  label: string;
  icon: React.ReactNode;
  buttonLabel?: string;
}

export const ModulePlaceholderNode: React.FC<ModulePlaceholderNodeProps> = ({ 
  label, 
  icon, 
  buttonLabel = "Process" 
}) => {
  return (
    <div className="flex flex-col gap-4 py-4 items-center justify-center border border-dashed border-white/10 rounded-lg bg-black/20 min-h-[140px]">
      <div className="text-gray-600 transition-colors group-hover:text-gray-400">
        {icon}
      </div>
      <span className="text-[12px] font-medium text-gray-500 text-center px-4 leading-tight">
        {label}
      </span>
      <button className="mt-2 px-6 py-2 rounded-md bg-white/5 border border-white/10 text-[11px] font-bold text-gray-500 hover:text-white transition-all cursor-not-allowed">
        {buttonLabel}
      </button>
    </div>
  );
};
