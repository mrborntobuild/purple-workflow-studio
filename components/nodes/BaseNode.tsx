
import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Copy, Trash2 } from 'lucide-react';
import { Handle, Position } from '@xyflow/react';
import { NodeType, DataType } from '../../types';

export interface PortConfig {
  label: string;
  color?: string;
  icon?: React.ReactNode;
  dataType?: DataType; // Explicit data type override for validation
}

interface BaseNodeProps {
  id: string;
  type: NodeType;
  label: string;
  selected?: boolean;
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
  children: React.ReactNode;
  onMouseDown: (e: React.MouseEvent) => void;
  inputs?: PortConfig[];
  outputs?: PortConfig[];
  headerIcon?: React.ReactNode;
  onOutputPortMouseDown?: (portIndex: number, e: React.MouseEvent) => void;
  inputPortPosition?: 'top' | 'center' | 'bottom';
  outputPortPosition?: 'top' | 'center' | 'bottom';
}

const Port: React.FC<{ 
  config: PortConfig; 
  side: 'left' | 'right';
  nodeId?: string;
  portIndex?: number;
  onOutputPortClick?: (portIndex: number, e: React.MouseEvent) => void;
}> = ({ config, side, nodeId, portIndex, onOutputPortClick }) => {
  const isLeft = side === 'left';
  const color = config.color || '#ffffff';
  const handleId = isLeft ? `input-${portIndex}` : `output-${portIndex}`;

  const handlePortClick = (e: React.MouseEvent) => {
    if (!isLeft && onOutputPortClick && portIndex !== undefined) {
      onOutputPortClick(portIndex, e);
    }
  };

  return (
    <div 
      className={`flex items-center ${isLeft ? 'flex-row-reverse' : 'flex-row'} ${!isLeft ? 'cursor-pointer' : ''}`}
      onClick={handlePortClick}
    >
      {/* Port Body */}
      <div className="relative flex h-10 w-6 items-center justify-center overflow-visible pointer-events-auto flex-shrink-0">
        {/* React Flow Handle */}
        <Handle
          type={isLeft ? 'target' : 'source'}
          position={isLeft ? Position.Left : Position.Right}
          id={handleId}
          style={{
            width: '22px',
            height: '22px',
            border: `3.5px solid ${color}`,
            backgroundColor: '#1a1b1e',
            borderRadius: '50%',
            boxShadow: `0 0 15px ${color}66`,
            top: '50%',
            transform: 'translateY(-50%)',
            left: isLeft ? 'auto' : '0',
            right: isLeft ? '0' : 'auto',
            cursor: isLeft ? 'crosshair' : 'grab',
          }}
          className="!border-[3.5px] hover:scale-110 transition-transform"
        >
          {config.icon && (
            <div className="text-[12px] font-bold text-white leading-none flex items-center justify-center w-full h-full">
              {config.icon}
            </div>
          )}
        </Handle>
      </div>

      {/* Label - Positioned next to the circle */}
      <span 
        className={`${isLeft ? 'mr-4' : 'ml-4'} text-[11px] font-mono font-black tracking-tight uppercase whitespace-nowrap select-none`}
        style={{ color: isLeft ? '#6b7280' : color }}
      >
        {config.label}
      </span>
    </div>
  );
};

export const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  type,
  label,
  selected,
  onDelete,
  onDuplicate,
  children,
  onMouseDown,
  inputs = [],
  outputs = [],
  headerIcon,
  onOutputPortMouseDown,
  inputPortPosition = 'center',
  outputPortPosition = 'center'
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);
  // Calculate positioning classes for input ports
  const getInputPortContainerClass = () => {
    const baseClass = "absolute right-full flex flex-col gap-4 pointer-events-none z-30";
    if (inputPortPosition === 'top') {
      return `${baseClass} top-[56px] items-start`;
    } else if (inputPortPosition === 'bottom') {
      return `${baseClass} bottom-0 items-end`;
    }
    return `${baseClass} top-[56px] bottom-0 justify-center`; // center (default)
  };

  // Calculate positioning classes for output ports
  const getOutputPortContainerClass = () => {
    const baseClass = "absolute left-full flex flex-col gap-4 pointer-events-none z-30";
    if (outputPortPosition === 'top') {
      return `${baseClass} top-[56px] items-start`;
    } else if (outputPortPosition === 'bottom') {
      return `${baseClass} bottom-0 items-end`;
    }
    return `${baseClass} top-[56px] bottom-0 justify-center`; // center (default)
  };

  return (
    <div 
      className={`relative flex w-[340px] flex-col overflow-visible rounded-2xl transition-all duration-200 bg-[#1a1b1e] border-0 outline-none group ${
        selected ? 'ring-2 ring-purple-500/60' : ''
      }`}
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      onMouseDown={onMouseDown}
    >
      {/* Node Header */}
      <div className="flex h-[56px] items-center justify-between px-5">
        <div className="flex items-center gap-3">
          {headerIcon && <div className="text-gray-400">{headerIcon}</div>}
          <span className="text-[15px] font-bold text-gray-200 tracking-tight">
            {label}
          </span>
        </div>
        <div className="relative flex items-center gap-2" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1 text-gray-600 hover:text-white transition-colors opacity-60 group-hover:opacity-100"
          >
            <MoreHorizontal size={16} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 z-50 min-w-[140px] rounded-xl border border-white/10 bg-[#1a1b1e] py-1 shadow-2xl">
              {onDuplicate && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDuplicate(id); setShowMenu(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 transition-colors"
                >
                  <Copy size={13} />
                  Duplicate
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(id); setShowMenu(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Port Containers - POSITIONED COMPLETELY OUTSIDE THE NODE BORDER */}
      {/* Input Ports (Left) */}
      <div className={getInputPortContainerClass()}>
        {inputs.map((p, i) => (
          <Port 
            key={`in-${i}`} 
            config={p} 
            side="left"
            nodeId={id}
            portIndex={i}
          />
        ))}
      </div>

      {/* Output Ports (Right) - All are interactive */}
      <div className={getOutputPortContainerClass()}>
        {outputs.map((p, i) => (
          <Port 
            key={`out-${i}`}
            config={p} 
            side="right"
            nodeId={id}
            portIndex={i}
            onOutputPortClick={onOutputPortMouseDown}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="mx-4 mb-4 flex-1 rounded-xl p-4 bg-[#212226] shadow-inner">
        {children}
      </div>
    </div>
  );
};
