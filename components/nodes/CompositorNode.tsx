
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export const CompositorNode: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Large Checkerboard Preview Area */}
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
        <div className="flex h-full w-full items-center justify-center bg-black/20">
          <ImageIcon size={48} className="text-white/[0.03]" strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};
