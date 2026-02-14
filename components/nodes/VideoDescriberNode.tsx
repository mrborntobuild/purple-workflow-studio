import React from 'react';
import { Play } from 'lucide-react';
import { useAutoResizeTextarea } from '../../hooks/useAutoResizeTextarea';

interface VideoDescriberNodeProps {
  content: string;
  status?: string;
  onUpdate: (data: any) => void;
  onRun?: () => void;
}

export const VideoDescriberNode: React.FC<VideoDescriberNodeProps> = ({ content, status, onUpdate, onRun }) => {
  const { ref, resize } = useAutoResizeTextarea(content, { minHeight: 120, maxHeight: 400 });

  return (
    <div className="flex flex-col gap-4 min-h-[300px]">
      <textarea
        ref={ref}
        className="w-full min-h-[120px] max-h-[400px] overflow-y-auto resize-none rounded-xl bg-[#161719] p-4 text-[15px] leading-relaxed text-gray-300 placeholder-gray-600 outline-none border border-white/5 shadow-inner"
        placeholder="The generated text will appear here"
        value={content}
        onChange={(e) => {
          onUpdate({ content: e.target.value });
          resize();
        }}
      />
      
      <div className="flex items-center justify-end mt-auto">
        <button 
          onClick={(e) => { e.stopPropagation(); onRun?.(); }}
          disabled={status === 'loading'}
          className="flex items-center gap-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 px-6 py-2.5 text-[13px] font-bold text-gray-200 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
        >
          {status === 'loading' ? 'Watching...' : (
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
