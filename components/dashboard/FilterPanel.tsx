import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterState {
  dateFrom: Date | null;
  dateTo: Date | null;
  status: 'all' | 'draft' | 'published';
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.status !== 'all';

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const formatDateDisplay = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      dateFrom: value ? new Date(value) : null
    });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      dateTo: value ? new Date(value) : null
    });
  };

  const handleStatusChange = (status: FilterState['status']) => {
    onFiltersChange({
      ...filters,
      status
    });
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          hasActiveFilters
            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-[0_0_10px_rgba(147,51,234,0.15)]'
            : 'bg-[#1a1b1e] border border-white/10 text-gray-300 hover:bg-[#252629] hover:border-white/20'
        }`}
      >
        <Filter size={14} />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-purple-500 text-white text-[10px] font-bold rounded-full">
            {(filters.dateFrom ? 1 : 0) + (filters.dateTo ? 1 : 0) + (filters.status !== 'all' ? 1 : 0)}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel Dropdown */}
      {isExpanded && (
        <div className="absolute right-0 mt-2 w-[280px] bg-[#18191c] border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#1a1b1e]">
            <span className="text-sm font-semibold text-white">Filters</span>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  onClearFilters();
                }}
                className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5"
              >
                <X size={12} />
                Clear
              </button>
            )}
          </div>

          <div className="p-4 space-y-5">
            {/* Date Range */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Date Range
              </label>
              <div className="space-y-2">
                {/* From Date */}
                <div className="group relative">
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                    <Calendar size={14} className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type="date"
                    value={formatDateForInput(filters.dateFrom)}
                    onChange={handleDateFromChange}
                    className="w-full bg-[#111214] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-200
                      focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
                      transition-all duration-200 [color-scheme:dark]
                      placeholder:text-gray-600"
                    placeholder="From date"
                  />
                  {!filters.dateFrom && (
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                      From
                    </span>
                  )}
                </div>

                {/* To Date */}
                <div className="group relative">
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                    <Calendar size={14} className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type="date"
                    value={formatDateForInput(filters.dateTo)}
                    onChange={handleDateToChange}
                    className="w-full bg-[#111214] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-200
                      focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
                      transition-all duration-200 [color-scheme:dark]
                      placeholder:text-gray-600"
                    placeholder="To date"
                  />
                  {!filters.dateTo && (
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                      To
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Status
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#111214] rounded-lg border border-white/5">
                {(['all', 'draft', 'published'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 capitalize ${
                      filters.status === status
                        ? 'bg-purple-500/20 text-purple-300 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Apply button */}
          <div className="px-4 py-3 border-t border-white/5 bg-[#111214]">
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400
                text-white text-sm font-semibold rounded-lg transition-all duration-200
                shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30
                active:scale-[0.98]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
