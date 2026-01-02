
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { NodeType } from '../../types';

export interface PortConfig {
  label: string;
  color?: string;
  icon?: React.ReactNode;
}

interface BaseNodeProps {
  id: string;
  type: NodeType;
  label: string;
  selected?: boolean;
  onDelete: (id: string) => void;
  children: React.ReactNode;
  onMouseDown: (e: React.MouseEvent) => void;
  inputs?: PortConfig[];
  outputs?: PortConfig[];
  headerIcon?: React.ReactNode;
}

const Port: React.FC<{ config: PortConfig; side: 'left' | 'right' }> = ({ config, side }) => {
  const isLeft = side === 'left';
  const color = config.color || '#ffffff';

  return (
    <div className={`flex items-center ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Port Body - The area sticking out of the node */}
      <div className="relative flex h-10 w-6 items-center justify-center overflow-visible pointer-events-auto flex-shrink-0">
        {/* Tab Protrusion - Background piece that connects to the node edge */}
        <div 
          className={`absolute ${isLeft ? 'right-0 rounded-l-full border-l' : 'left-0 rounded-r-full border-r'} h-[36px] w-8 bg-[#1a1b1e] border-t border-b border-white/10 shadow-2xl`} 
          style={{ 
            transform: isLeft ? 'translateX(2px)' : 'translateX(-2px)' 
          }}
        />
        
        {/* Connection Point - A clean, unsquashable geometric circle */}
        <div 
          className={`z-10 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border-[3.5px] bg-[#1a1b1e] transition-transform hover:scale-110 cursor-crosshair aspect-square`}
          style={{ 
            borderColor: color,
            boxShadow: `0 0 15px ${color}66`,
          }}
        >
          {config.icon ? (
            <div className="text-[12px] font-bold text-white leading-none flex items-center justify-center">
              {config.icon}
            </div>
          ) : (
            <div className="h-1 w-1 rounded-full bg-transparent" />
          )}
        </div>
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
  children, 
  onMouseDown,
  inputs = [],
  outputs = [],
  headerIcon
}) => {
  return (
    <div 
      className={`relative flex min-w-[340px] flex-col overflow-visible rounded-2xl border transition-all duration-200 bg-[#1a1b1e] shadow-2xl backdrop-blur-sm group ${
        selected ? 'border-purple-500/60 ring-1 ring-purple-500/20' : 'border-white/5'
      }`}
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
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-600 hover:text-white transition-colors opacity-60 group-hover:opacity-100">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Port Containers - POSITIONED COMPLETELY OUTSIDE THE NODE BORDER */}
      {/* Input Ports (Left) */}
      <div className="absolute right-full top-[56px] bottom-0 flex flex-col justify-center gap-4 pointer-events-none z-30">
        {inputs.map((p, i) => (
          <Port key={`in-${i}`} config={p} side="left" />
        ))}
      </div>

      {/* Output Ports (Right) */}
      <div className="absolute left-full top-[56px] bottom-0 flex flex-col justify-center gap-4 pointer-events-none z-30">
        {outputs.map((p, i) => (
          <Port key={`out-${i}`} config={p} side="right" />
        ))}
      </div>

      {/* Content Container */}
      <div className="mx-4 mb-4 flex-1 rounded-xl p-4 bg-[#212226] border border-white/[0.04] shadow-inner overflow-hidden">
        {children}
      </div>
    </div>
  );
};
