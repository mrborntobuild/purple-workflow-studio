import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { NodeType, SidebarItem, DataType } from '../types';
import { SIDEBAR_ITEMS } from '../App';
import { hasCompatibleInputPort } from '../utils/typeValidation';

interface NodePickerProps {
  x: number;
  y: number;
  onSelect: (type: NodeType) => void;
  onClose: () => void;
  sourceOutputType?: DataType;
  sourcePortIndex?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  'quick-access': 'Quick Access',
  'toolbox': 'Toolbox',
  'image-models': 'Image Models',
  'video-models': 'Video Models',
  'lip-sync': 'Lip Sync',
  'upscaling': 'Upscaling & Enhancement',
  '3d-gen': '3D Generation',
  'audio-tts': 'Audio / TTS',
  'utility': 'Utility',
};

const SUBCATEGORY_LABELS: Record<string, string> = {
  'editing': 'Editing',
  'text': 'Text Tools',
  'datatypes': 'Data Types',
  'functions': 'Functions',
};

export const NodePicker: React.FC<NodePickerProps> = ({ 
  x, 
  y, 
  onSelect, 
  onClose,
  sourceOutputType,
  sourcePortIndex = 0
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    let items = SIDEBAR_ITEMS;
    
    // If we have a source output type, filter to only compatible nodes
    if (sourceOutputType) {
      items = items.filter(item => {
        return hasCompatibleInputPort(item.id, sourceOutputType);
      });
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.label.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(query))
      );
    }
    
    return items;
  }, [searchQuery, sourceOutputType]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, SidebarItem[]> = {};
    
    filteredItems.forEach(item => {
      const categoryKey = item.subCategory ? `${item.category}-${item.subCategory}` : item.category;
      if (!groups[categoryKey]) {
        groups[categoryKey] = [];
      }
      groups[categoryKey].push(item);
    });
    
    return groups;
  }, [filteredItems]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Picker */}
      <div 
        className="fixed z-50 w-[320px] rounded-xl border border-white/10 bg-[#1a1b1e] shadow-2xl backdrop-blur-xl"
        style={{ 
          left: `${x}px`, 
          top: `${y}px`,
          maxHeight: '500px',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="relative p-3 border-b border-white/5">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
          <input 
            type="text" 
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-[#0e0e11] pl-9 pr-9 py-2 text-sm text-gray-300 outline-none ring-1 ring-white/5 focus:ring-purple-500/30"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {Object.entries(groupedItems).map(([categoryKey, items]) => {
            const [category, subCategory] = categoryKey.split('-');
            const displayLabel = subCategory 
              ? SUBCATEGORY_LABELS[subCategory] || subCategory
              : CATEGORY_LABELS[category] || category;
            
            return (
              <div key={categoryKey} className="mb-2">
                <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {displayLabel}
                </div>
                {items.map(item => {
                  // Check if this node is compatible (already filtered, but check for visual feedback)
                  const isCompatible = sourceOutputType 
                    ? hasCompatibleInputPort(item.id, sourceOutputType)
                    : true;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item.id);
                        onClose();
                      }}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-3 ${
                        isCompatible
                          ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                          : 'text-gray-600 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-gray-500">{item.icon}</div>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
          
          {Object.keys(groupedItems).length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-gray-500">
              No nodes found
            </div>
          )}
        </div>
      </div>
    </>
  );
};

