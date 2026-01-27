import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, X } from 'lucide-react';

interface VideoModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, isOpen, onClose }) => {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'generated-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">AI Generated Video</h2>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            <Download size={18} />
            Download
          </button>
          <button
            className="p-2 text-gray-400 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div
        className="flex-1 flex items-center justify-center p-8 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={videoUrl}
          controls
          autoPlay
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
