import React from 'react';
import { Sparkles } from 'lucide-react';

export const AppView: React.FC = () => {
  return (
    <div className="absolute inset-0 top-14 flex items-center justify-center bg-[#050506]">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-purple-600/20 flex items-center justify-center">
            <Sparkles size={48} className="text-purple-500" />
          </div>
          <div className="absolute inset-0 h-24 w-24 rounded-full bg-purple-600/20 animate-ping" />
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Coming Soon
          </h1>
          <p className="text-lg text-gray-400 max-w-md">
            The App builder is under development. Soon you'll be able to create interactive apps from your workflows.
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-sm text-gray-400">In Development</span>
        </div>
      </div>
    </div>
  );
};
