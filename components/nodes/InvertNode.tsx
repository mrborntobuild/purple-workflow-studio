
import React, { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';
import { applyInvert } from '../../utils/imageProcessing';

interface InvertNodeProps {
  inputImageUrl?: string;
  onUpdate: (data: any) => void;
}

export const InvertNode: React.FC<InvertNodeProps> = ({ inputImageUrl, onUpdate }) => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (inputImageUrl) {
      setIsProcessing(true);
      applyInvert(inputImageUrl)
        .then((url) => {
          setProcessedImageUrl(url);
          onUpdate({ imageUrl: url });
          setIsProcessing(false);
        })
        .catch((err) => {
          setIsProcessing(false);
        });
    } else {
      setProcessedImageUrl(null);
    }
  }, [inputImageUrl, onUpdate]);

  const displayImage = processedImageUrl || inputImageUrl;

  return (
    <div className="flex flex-col">
      <div 
        className="relative aspect-square w-full rounded-lg overflow-hidden border border-white/5 shadow-inner"
        style={{
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
        {displayImage ? (
          <>
            <img 
              src={displayImage} 
              alt="Invert preview" 
              className="h-full w-full object-contain"
              style={{ opacity: isProcessing ? 0.6 : 1 }}
            />
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="text-[11px] text-gray-400">Processing...</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5">
            <RefreshCcw size={48} className="text-white/[0.02]" strokeWidth={1} />
          </div>
        )}
      </div>
    </div>
  );
};
