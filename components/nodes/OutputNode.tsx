import React from 'react';
import { Flag } from 'lucide-react';

interface OutputNodeProps {
  connectedResults?: number;
}

export const OutputNode: React.FC<OutputNodeProps> = ({ connectedResults = 0 }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[120px] gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-500/40">
        <Flag size={28} className="text-orange-500" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-300">Workflow Output</p>
        <p className="text-xs text-gray-500 mt-1">
          {connectedResults === 0
            ? 'Connect nodes to display results'
            : `${connectedResults} result${connectedResults > 1 ? 's' : ''} connected`}
        </p>
      </div>
    </div>
  );
};
