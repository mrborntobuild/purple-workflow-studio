import React, { useState } from 'react';
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

  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.status !== 'all';

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
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
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          hasActiveFilters
            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            : 'bg-[#1a1b1e] border border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/10'
        }`}
      >
        <Filter size={14} />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="w-5 h-5 flex items-center justify-center bg-purple-500 text-white text-xs font-bold rounded-full">
            {(filters.dateFrom ? 1 : 0) + (filters.dateTo ? 1 : 0) + (filters.status !== 'all' ? 1 : 0)}
          </span>
        )}
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Filter Panel Dropdown */}
      {isExpanded && (
        <div className="absolute right-0 mt-2 w-72 bg-[#1a1b1e] border border-white/10 rounded-xl shadow-xl z-[100] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <span className="text-sm font-semibold text-white">Filters</span>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <X size={12} />
                Clear
              </button>
            )}
          </div>

          <div className="p-4 space-y-4">
            {/* Date Range - Stacked vertically */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="date"
                    value={formatDateForInput(filters.dateFrom)}
                    onChange={handleDateFromChange}
                    placeholder="From"
                    className="w-full bg-[#111214] border border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="date"
                    value={formatDateForInput(filters.dateTo)}
                    onChange={handleDateToChange}
                    placeholder="To"
                    className="w-full bg-[#111214] border border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Status
              </label>
              <div className="flex gap-2">
                {(['all', 'draft', 'published'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                      filters.status === status
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-[#111214] border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
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
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
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
