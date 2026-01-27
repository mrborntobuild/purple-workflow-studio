
import React, { useState } from 'react';
import { Film, Play } from 'lucide-react';
import { VideoModal } from './VideoModal';

interface VideoNodeProps {
  videoUrl?: string;
  content: string;
  status?: string;
  progress?: number;
  onUpdate: (data: any) => void;
  onRun?: () => void;
  nodeType?: string;
  nodeId?: string;
  aspectRatio?: string;
}

// Convert aspect ratio string to CSS aspect-ratio value
const getAspectRatioValue = (ratio?: string): string => {
  switch (ratio) {
    case '16:9':
      return '16/9';
    case '9:16':
      return '9/16';
    case '1:1':
      return '1/1';
    case '4:3':
      return '4/3';
    case '3:4':
      return '3/4';
    case '21:9':
      return '21/9';
    default:
      return '16/9'; // Default to 16:9 for video
  }
};

export const VideoNode: React.FC<VideoNodeProps> = ({
  videoUrl,
  content,
  status,
  progress,
  onUpdate,
  onRun,
  nodeType,
  nodeId,
  aspectRatio
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRun = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRun) {
      onRun();
    }
  };

  // Handle video click to open modal (only when video is generated and not loading)
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoUrl && status !== 'loading') {
      setIsModalOpen(true);
    }
  };

  const aspectRatioValue = getAspectRatioValue(aspectRatio);

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Video Preview Area */}
        <div
          className={`relative w-full rounded-lg overflow-hidden border border-white/5 shadow-inner ${
            videoUrl && status !== 'loading' ? 'cursor-pointer' : ''
          }`}
          onClick={handleVideoClick}
          style={{
            aspectRatio: aspectRatioValue,
            backgroundColor: '#1a1b1e',
            backgroundImage: `
              linear-gradient(45deg, #25262b 25%, transparent 25%),
              linear-gradient(-45deg, #25262b 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #25262b 75%),
              linear-gradient(-45deg, transparent 75%, #25262b 75%)
            `,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px'
          }}
        >
          {videoUrl ? (
            <>
              {/* Video thumbnail - shows first frame */}
              <video
                src={videoUrl}
                className="h-full w-full object-contain select-none pointer-events-none"
                style={{ opacity: status === 'loading' ? 0.6 : 1 }}
                muted
                playsInline
                preload="metadata"
              />
              {/* Play button overlay - always shown when video is ready */}
              {status !== 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all hover:scale-105">
                    <Play size={28} className="text-gray-900 fill-current ml-1" />
                  </div>
                </div>
              )}
              {status === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                  {/* Rotating Purple Spinner */}
                  <div className="relative mb-4">
                    <div className="w-12 h-12 border-4 border-purple-500/20 rounded-full"></div>
                    <div
                      className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
                      style={{ animationDuration: '1s' }}
                    ></div>
                  </div>

                  {progress !== undefined && progress > 0 ? (
                    <>
                      <div className="w-3/4 h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400">
                        Generating... {progress}%
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] text-gray-400">Generating...</span>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {status === 'loading' ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-black/20">
                  {/* Rotating Purple Spinner */}
                  <div className="relative mb-4">
                    <div className="w-12 h-12 border-4 border-purple-500/20 rounded-full"></div>
                    <div
                      className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
                      style={{ animationDuration: '1s' }}
                    ></div>
                  </div>
                  {progress !== undefined && progress > 0 ? (
                    <>
                      <div className="w-3/4 h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400">
                        Generating... {progress}%
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] text-gray-400">Generating...</span>
                  )}
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black/20">
                  <Film size={48} className="text-white/[0.03]" strokeWidth={1} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col gap-3 mt-auto">
          {onRun && (
            <button
              onClick={handleRun}
              disabled={status === 'loading'}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 px-6 py-2.5 text-[13px] font-bold text-gray-200 transition-all active:scale-95 disabled:opacity-50 shadow-lg w-full"
            >
              {status === 'loading' ? 'Generating...' : (
                <>
                  <Play size={14} className="fill-current" />
                  Run Model
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <VideoModal
        videoUrl={videoUrl || ''}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
