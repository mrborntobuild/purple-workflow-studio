import React from 'react';
import { useAutoResizeTextarea } from '../../hooks/useAutoResizeTextarea';

interface TextNodeProps {
  content: string;
  onUpdate: (data: any) => void;
}

export const TextNode: React.FC<TextNodeProps> = ({ content, onUpdate }) => {
  const { ref, resize } = useAutoResizeTextarea(content, { minHeight: 80 });

  return (
    <div className="flex flex-col min-h-[100px]">
      <textarea
        ref={ref}
        className="w-full min-h-[80px] overflow-hidden resize-none rounded-lg bg-transparent p-1 text-[14px] leading-relaxed text-gray-300 placeholder-gray-600 outline-none"
        placeholder="Enter static text or annotations..."
        value={content}
        onChange={(e) => {
          onUpdate({ content: e.target.value });
          resize();
        }}
      />
    </div>
  );
};
