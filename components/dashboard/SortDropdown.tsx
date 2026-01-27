import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowUp, ArrowDown, Clock, Calendar, Type, Layers } from 'lucide-react';

export type SortOption = 'updated_at' | 'created_at' | 'name' | 'node_count';
export type SortOrder = 'asc' | 'desc';

interface SortDropdownProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortOption, sortOrder: SortOrder) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'updated_at', label: 'Last edited', icon: <Clock size={14} /> },
  { value: 'created_at', label: 'Created date', icon: <Calendar size={14} /> },
  { value: 'name', label: 'Name', icon: <Type size={14} /> },
  { value: 'node_count', label: 'Node count', icon: <Layers size={14} /> },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, sortOrder, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = SORT_OPTIONS.find(opt => opt.value === sortBy);

  const handleOptionClick = (option: SortOption) => {
    if (option === sortBy) {
      // Toggle order if same option clicked
      onSortChange(option, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New option - use default order based on type
      const defaultOrder: SortOrder = option === 'name' ? 'asc' : 'desc';
      onSortChange(option, defaultOrder);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#1a1b1e] border border-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:border-white/10 transition-colors"
      >
        {currentOption?.icon}
        <span>{currentOption?.label}</span>
        {sortOrder === 'asc' ? (
          <ArrowUp size={14} className="text-gray-500" />
        ) : (
          <ArrowDown size={14} className="text-gray-500" />
        )}
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1a1b1e] border border-white/10 rounded-xl shadow-xl z-[100] overflow-hidden">
          <div className="py-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                  sortBy === option.value
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
                {sortBy === option.value && (
                  sortOrder === 'asc' ? (
                    <ArrowUp size={14} />
                  ) : (
                    <ArrowDown size={14} />
                  )
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
