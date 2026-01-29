import React from 'react';
import { Play } from 'lucide-react';

interface StartWorkflowNodeProps {
  connectedTriggers?: number;
}

export const StartWorkflowNode: React.FC<StartWorkflowNodeProps> = ({ connectedTriggers = 0 }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[120px] gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/40">
        <Play size={32} className="text-green-500 ml-1" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-300">Workflow Entry Point</p>
        <p className="text-xs text-gray-500 mt-1">
          {connectedTriggers === 0
            ? 'Connect to text or file nodes'
            : `${connectedTriggers} trigger${connectedTriggers > 1 ? 's' : ''} connected`}
        </p>
      </div>
    </div>
  );
};
