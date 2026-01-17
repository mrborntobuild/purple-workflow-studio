
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { LazyImage } from './LazyImage';

interface PreviewNodeProps {
  imageUrl?: string;
}

export const PreviewNode: React.FC<PreviewNodeProps> = ({ imageUrl }) => {
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
        {imageUrl ? (
          <LazyImage src={imageUrl} alt="Preview" className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon size={32} className="text-white/5" strokeWidth={1} />
          </div>
        )}
      </div>
    </div>
  );
};
