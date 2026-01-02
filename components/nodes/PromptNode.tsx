
import React from 'react';

interface PromptNodeProps {
  content: string;
  onUpdate: (data: any) => void;
}

export const PromptNode: React.FC<PromptNodeProps> = ({ content, onUpdate }) => {
  return (
    <div className="flex flex-col min-h-[140px]">
      <textarea 
        className="w-full flex-1 resize-none rounded-lg bg-transparent p-1 text-[15px] leading-relaxed text-gray-300 placeholder-gray-600 outline-none"
        placeholder="Describe what you're imagining..."
        value={content}
        onChange={(e) => onUpdate({ content: e.target.value })}
      />
    </div>
  );
};
