
import React, { useState, useRef, useEffect } from 'react';
import { X, Palette } from 'lucide-react';

interface StickyNoteNodeProps {
  id: string;
  label: string;
  content: string;
  noteColor?: string;
  noteWidth?: number;
  noteHeight?: number;
  selected?: boolean;
  onDelete: (id: string) => void;
  onUpdate: (data: any) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

const COLOR_OPTIONS = [
  { name: 'yellow', value: '#fef08a', textColor: '#713f12' },
  { name: 'pink', value: '#fce7f3', textColor: '#831843' },
  { name: 'blue', value: '#dbeafe', textColor: '#1e3a8a' },
  { name: 'green', value: '#dcfce7', textColor: '#14532d' },
  { name: 'purple', value: '#e9d5ff', textColor: '#581c87' },
];

const DEFAULT_WIDTH = 240;
const DEFAULT_HEIGHT = 200;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;
const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;

export const StickyNoteNode: React.FC<StickyNoteNodeProps> = ({
  id,
  label,
  content,
  noteColor = 'yellow',
  noteWidth,
  noteHeight,
  selected,
  onDelete,
  onUpdate,
  onMouseDown,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const currentColor = COLOR_OPTIONS.find(c => c.name === noteColor) || COLOR_OPTIONS[0];
  const bgColor = currentColor.value;
  const textColor = currentColor.textColor;
  
  const width = noteWidth || DEFAULT_WIDTH;
  const height = noteHeight || DEFAULT_HEIGHT;

  const handleTitleChange = (newTitle: string) => {
    onUpdate({ label: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    onUpdate({ content: newContent });
  };

  const handleColorChange = (colorName: string) => {
    onUpdate({ noteColor: colorName });
    setShowColorPicker(false);
  };

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: width,
      height: height,
    });
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resizeStart.width + deltaX));
      const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStart.height + deltaY));
      
      onUpdate({ noteWidth: newWidth, noteHeight: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart, onUpdate, width, height]);

  return (
    <div
      ref={nodeRef}
      className={`relative flex flex-col rounded-lg shadow-lg transition-all duration-200 ${
        selected ? 'ring-2 ring-purple-500/60 ring-offset-2 ring-offset-[#050506]' : ''
      } ${isResizing ? 'select-none' : ''}`}
      style={{
        backgroundColor: bgColor,
        width: `${width}px`,
        height: `${height}px`,
        boxShadow: selected 
          ? `0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px ${bgColor}`
          : '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      }}
      onMouseDown={onMouseDown}
    >
      {/* Corner fold effect */}
      <div
        className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 0%, transparent 50%, ${bgColor}88 50%, ${bgColor}88 100%)`,
        }}
      >
        <div
          className="absolute top-0 right-0 w-8 h-8"
          style={{
            background: `linear-gradient(135deg, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1) 100%)`,
          }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 flex-shrink-0">
        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={label}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingTitle(false);
                }
              }}
              className="w-full bg-transparent border-none outline-none text-sm font-bold"
              style={{ color: textColor }}
              autoFocus
            />
          ) : (
            <div
              className="text-sm font-bold cursor-text truncate"
              style={{ color: textColor }}
              onDoubleClick={() => setIsEditingTitle(true)}
              title="Double-click to edit"
            >
              {label || 'Sticky Note'}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {/* Color Picker Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(!showColorPicker);
              }}
              className="p-1 rounded hover:bg-black/10 transition-colors"
              style={{ color: textColor }}
              title="Change color"
            >
              <Palette size={14} />
            </button>
            {showColorPicker && (
              <div className="absolute right-0 top-6 z-50 bg-[#1a1b1e] border border-white/10 rounded-lg p-2 shadow-xl flex gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorChange(color.name);
                    }}
                    className={`w-6 h-6 rounded border-2 transition-all ${
                      noteColor === color.name ? 'border-white scale-110' : 'border-transparent hover:border-white/50'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="p-1 rounded hover:bg-black/10 transition-colors opacity-60 hover:opacity-100"
            style={{ color: textColor }}
            title="Delete note"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-3 pb-3 flex-1 overflow-hidden flex flex-col min-h-0">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Write your note here..."
          className="w-full h-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed placeholder-opacity-50"
          style={{
            color: textColor,
          }}
        />
      </div>

      {/* Resize Handle - Bottom Right Corner */}
      {selected && (
        <div
          className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-10"
          onMouseDown={handleResizeStart}
          style={{
            background: `linear-gradient(135deg, transparent 0%, transparent 50%, ${textColor}30 50%, ${textColor}30 100%)`,
          }}
          title="Drag to resize"
        >
          <div
            className="absolute bottom-0 right-0 w-3 h-3"
            style={{
              background: `${textColor}`,
              clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
              opacity: 0.6,
            }}
          />
        </div>
      )}

      {/* Click outside to close color picker */}
      {showColorPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowColorPicker(false)}
        />
      )}
    </div>
  );
};
