
import React from 'react';
import { Plus, Edit3 } from 'lucide-react';
import { LazyImage } from './LazyImage';

interface StyleGuideNodeProps {
  // Array of image URLs corresponding to the inputs
  inputImageUrls: (string | undefined)[];
  // Number of "Layer" inputs (excluding Background)
  layerCount: number;
  onUpdate: (data: any) => void;
}

export const StyleGuideNode: React.FC<StyleGuideNodeProps> = ({
  inputImageUrls,
  layerCount,
  onUpdate,
}) => {
  // Handle adding a new layer input
  const handleAddLayer = () => {
    onUpdate({
      panelSettings: {
        layerCount: layerCount + 1,
      },
    });
  };

  // We display the "Layer" images in the grid. 
  // Input 0 is "Background", Input 1 is "Layer 1", Input 2 is "Layer 2", etc.
  // We want to show Layer 1, Layer 2, Layer 3, Layer 4 in the grid (indices 1, 2, 3, 4).
  const gridImages = inputImageUrls.slice(1, 5); // Take up to 4 layers for the 2x2 grid

  return (
    <div className="flex flex-col gap-4">
      {/* Grid Display (2x2) */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#25262b] p-2">
        <div className="grid grid-cols-2 gap-2 w-full h-full">
          {[0, 1, 2, 3].map((i) => {
            const imageUrl = gridImages[i];
            return (
              <div
                key={i}
                className="relative w-full h-full bg-[#1a1b1e] rounded-lg overflow-hidden group"
              >
                {imageUrl ? (
                  <LazyImage
                    src={imageUrl}
                    alt={`Layer ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/5 text-[10px] font-mono uppercase tracking-widest">
                    Layer {i + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={handleAddLayer}
          className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-white transition-colors"
        >
          <Plus size={14} />
          Add another layer
        </button>

        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[12px] font-medium text-gray-300 transition-colors border border-white/5 hover:border-white/10"
        >
          <Edit3 size={12} />
          Edit
        </button>
      </div>
    </div>
  );
};
