
import React from 'react';

interface TextNodeProps {
  content: string;
  onUpdate: (data: any) => void;
}

export const TextNode: React.FC<TextNodeProps> = ({ content, onUpdate }) => {
  return (
    <div className="flex flex-col min-h-[100px]">
      <textarea 
        className="w-full flex-1 resize-none rounded-lg bg-transparent p-1 text-[14px] leading-relaxed text-gray-300 placeholder-gray-600 outline-none"
        placeholder="Enter static text or annotations..."
        value={content}
        onChange={(e) => onUpdate({ content: e.target.value })}
      />
    </div>
  );
};
