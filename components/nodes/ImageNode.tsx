
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageNodeProps {
  imageUrl?: string;
  content: string;
  status?: string;
  onUpdate: (data: any) => void;
  onRun?: () => void;
}

export const ImageNode: React.FC<ImageNodeProps> = ({ imageUrl, content, status, onUpdate, onRun }) => {
  return (
    <div className="flex flex-col gap-4">
       {imageUrl ? (
        <div className="relative aspect-square overflow-hidden rounded-lg bg-black/40 group/img">
          <img src={imageUrl} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
             <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
               <ImageIcon size={18} />
             </button>
          </div>
        </div>
      ) : (
        <div className="flex aspect-square w-full flex-col items-center justify-center rounded-lg border border-dashed border-white/5 bg-black/20">
          <ImageIcon size={24} className="mb-2 text-gray-700" />
          <span className="text-[10px] text-gray-600">No image generated yet</span>
        </div>
      )}
      <textarea 
        className="w-full resize-none rounded-lg bg-transparent p-0 text-[13px] text-gray-400 placeholder-gray-600 outline-none"
        placeholder="Visual instructions..."
        value={content}
        onChange={(e) => onUpdate({ content: e.target.value })}
      />
      {onRun && (
        <button 
          onClick={(e) => { e.stopPropagation(); onRun(); }}
          disabled={status === 'loading'}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600/10 py-3 text-xs font-bold text-blue-400 hover:bg-blue-600/20 border border-blue-500/20 active:scale-95 transition-all"
        >
          {status === 'loading' ? 'Visualizing...' : 'Generate Image'}
        </button>
      )}
    </div>
  );
};
