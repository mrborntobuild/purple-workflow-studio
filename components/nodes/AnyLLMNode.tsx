
import React from 'react';
import { Play } from 'lucide-react';

interface AnyLLMNodeProps {
  content: string;
  status?: string;
  mediaInputCount?: number; // Number of dynamic media input ports
  onUpdate: (data: any) => void;
  onRun?: () => void;
}

export const AnyLLMNode: React.FC<AnyLLMNodeProps> = ({ 
  content, 
  status, 
  mediaInputCount = 0,
  onUpdate, 
  onRun 
}) => {
  const handleAddMediaInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = (mediaInputCount || 0) + 1;
    onUpdate({ 
      panelSettings: { 
        mediaInputCount: newCount 
      } 
    });
  };

  const handleRemoveMediaInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaInputCount > 0) {
      const newCount = mediaInputCount - 1;
      onUpdate({ 
        panelSettings: { 
          mediaInputCount: newCount 
        } 
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-[400px]">
      <textarea 
        className="w-full flex-1 resize-none rounded-xl bg-[#161719] p-4 text-[15px] leading-relaxed text-gray-300 placeholder-gray-600 outline-none border border-white/5 shadow-inner"
        placeholder="The generated text will appear here"
        value={content}
        onChange={(e) => onUpdate({ content: e.target.value })}
      />
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAddMediaInput}
            className="flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-white transition-colors"
          >
            <span className="text-lg">+</span> Add another image input
          </button>
          {mediaInputCount > 0 && (
            <button 
              onClick={handleRemoveMediaInput}
              className="flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-red-400 transition-colors"
            >
              <span className="text-lg">−</span> Remove image input
            </button>
          )}
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onRun?.(); }}
          disabled={status === 'loading'}
          className="flex items-center gap-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 px-6 py-2.5 text-[13px] font-bold text-gray-200 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
        >
          {status === 'loading' ? 'Thinking...' : (
            <>
              <Play size={14} className="fill-current" />
              Run Model
            </>
          )}
        </button>
      </div>
    </div>
  );
};
