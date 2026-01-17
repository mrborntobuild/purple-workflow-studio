
import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

interface OptionsNodeProps {
  inputArray?: string[];
  onUpdate?: (data: any) => void;
}

export const OptionsNode: React.FC<OptionsNodeProps> = ({ inputArray, onUpdate }) => {
  const [options, setOptions] = useState<Array<{ id: number; value: string }>>([{ id: 1, value: "" }]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // When inputArray changes (from connected node), update options
  useEffect(() => {
    if (inputArray && Array.isArray(inputArray) && inputArray.length > 0) {
      const validOptions = inputArray.filter(opt => opt && opt.trim() !== '');
      if (validOptions.length > 0) {
        const newOptions = validOptions.map((opt, index) => ({
          id: Date.now() + index,
          value: opt.trim()
        }));
        setOptions(newOptions);
        if (onUpdate) {
          onUpdate({ options: newOptions.map(opt => opt.value) });
        }
      }
    }
  }, [inputArray, onUpdate]);

  const addOption = () => {
    const newOption = { id: Date.now(), value: "" };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    if (onUpdate) {
      onUpdate({ options: updatedOptions.map(opt => opt.value) });
    }
  };

  const removeOption = (id: number) => {
    if (options.length > 1) {
      const updatedOptions = options.filter(opt => opt.id !== id);
      setOptions(updatedOptions);
      if (updatedOptions.some(opt => opt.value === selectedOption)) {
        // Keep selection if it still exists
      } else {
        setSelectedOption("");
      }
      if (onUpdate) {
        onUpdate({ options: updatedOptions.map(opt => opt.value) });
      }
    }
  };

  const updateOption = (id: number, value: string) => {
    const updatedOptions = options.map(opt => 
      opt.id === id ? { ...opt, value } : opt
    );
    setOptions(updatedOptions);
    // Clear selection if the selected option was edited
    if (options.find(opt => opt.id === id)?.value === selectedOption) {
      setSelectedOption("");
    }
    if (onUpdate) {
      onUpdate({ options: updatedOptions.map(opt => opt.value) });
    }
  };

  const handleSelectOption = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false);
    if (onUpdate) {
      onUpdate({ selectedOption: value, options: options.map(opt => opt.value) });
    }
  };

  const availableOptions = options.filter(opt => opt.value.trim() !== '');

  return (
    <div className="flex flex-col gap-4">
      {/* Dropdown Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-lg bg-[#161719] border border-white/5 px-4 py-3 text-[13px] text-gray-300 hover:border-white/10 transition-colors"
        >
          <span className={selectedOption ? "text-gray-300" : "text-gray-500"}>
            {selectedOption || "Select an option"}
          </span>
          <ChevronDown size={14} className={`text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && availableOptions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 rounded-lg bg-[#1a1b1e] border border-white/10 shadow-xl overflow-hidden">
            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
              {availableOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.value)}
                  className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${
                    selectedOption === option.value
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {option.value}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Options List */}
      <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <div className="flex-1 rounded-lg bg-[#161719] border border-white/5 px-4 py-2 shadow-inner">
              <input 
                type="text" 
                placeholder="Option"
                value={option.value}
                onChange={(e) => updateOption(option.id, e.target.value)}
                className="w-full bg-transparent text-[13px] text-gray-300 placeholder-gray-600 outline-none" 
              />
            </div>
            <button 
              onClick={() => removeOption(option.id)}
              className="p-2 text-gray-600 hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={addOption}
        className="flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-white transition-colors px-1"
      >
        <Plus size={14} />
        Add another option
      </button>
    </div>
  );
};


