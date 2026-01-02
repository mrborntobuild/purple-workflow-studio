
import React from 'react';
import { Upload } from 'lucide-react';

interface ImportNodeProps {
  content: string;
  onUpdate: (data: any) => void;
}

export const ImportNode: React.FC<ImportNodeProps> = ({ content, onUpdate }) => {
  return (
    <div className="flex flex-col gap-3">
      <div 
        className="group/upload relative flex aspect-square w-full flex-col items-center justify-center rounded-xl overflow-hidden cursor-pointer"
        style={{
          backgroundColor: '#1a1b1e',
          backgroundImage: `
            linear-gradient(45deg, #25262b 25%, transparent 25%),
            linear-gradient(-45deg, #25262b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #25262b 75%),
            linear-gradient(-45deg, transparent 75%, #25262b 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        <div className="flex flex-col items-center justify-center gap-3 transition-transform group-hover/upload:scale-105">
          <Upload size={32} className="text-gray-400" strokeWidth={1.5} />
          <span className="text-sm font-medium text-gray-200">Drag & drop or click to upload</span>
        </div>
      </div>
      <div className="rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2">
        <input 
          type="text"
          placeholder="Paste a file link"
          className="w-full bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none"
          value={content}
          onChange={(e) => onUpdate({ content: e.target.value })}
        />
      </div>
    </div>
  );
};
