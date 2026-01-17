
import React, { useState, useRef, useEffect } from 'react';
import { NodeResizer } from '@xyflow/react';

interface GroupNodeProps {
  id: string;
  data: {
    label: string;
    width?: number;
    height?: number;
  };
  selected?: boolean;
  onUpdate: (data: any) => void;
}

export const GroupNode: React.FC<GroupNodeProps> = ({
  id,
  data,
  selected,
  onUpdate,
}) => {
  const [label, setLabel] = useState(data.label || 'Group');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleLabelSubmit = () => {
    setIsEditing(false);
    onUpdate({ label });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSubmit();
    }
  };

  // Default dimensions if not provided
  const width = data.width || 400;
  const height = data.height || 300;

  return (
    <div
      className={`relative rounded-xl border-2 transition-all ${
        selected 
          ? 'border-[#4ade80] bg-black/5' 
          : 'border-[#4ade80]/40 bg-transparent border-dashed'
      }`}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <NodeResizer 
        isVisible={selected} 
        minWidth={200} 
        minHeight={150}
        color="#4ade80"
        handleStyle={{ width: 8, height: 8, borderRadius: 4 }}
        lineStyle={{ border: 'none' }}
      />
      
      {/* Header / Label Area */}
      <div className="absolute -top-8 left-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={handleLabelChange}
            onBlur={handleLabelSubmit}
            onKeyDown={handleKeyDown}
            className="h-7 min-w-[120px] rounded-lg border border-green-500/50 bg-[#1a1b1e] px-2 text-xs font-bold text-green-400 outline-none focus:border-green-500"
          />
        ) : (
          <div
            onDoubleClick={() => setIsEditing(true)}
            className="flex h-7 items-center rounded-lg bg-[#4ade80] px-3 py-1 backdrop-blur-sm cursor-text shadow-lg"
          >
            <span className="text-xs font-bold uppercase tracking-wide text-[#050506]">
              {label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
