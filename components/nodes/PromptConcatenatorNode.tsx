
import React, { useState, useEffect, useRef } from 'react';

interface PromptConcatenatorNodeProps {
  prompt1?: string;
  prompt2?: string;
  textInputs?: string[]; // Array of text from dynamic ports (port 2, 3, 4, etc.)
  manualText?: string; // Single manual text input
  textInputPortCount?: number; // Number of dynamic text input ports
  onUpdate?: (data: any) => void;
}

export const PromptConcatenatorNode: React.FC<PromptConcatenatorNodeProps> = ({ 
  prompt1, 
  prompt2,
  textInputs = [],
  manualText = '',
  textInputPortCount = 0,
  onUpdate 
}) => {
  const [manualTextValue, setManualTextValue] = useState(manualText);
  
  // Use ref to track previous combined value to prevent unnecessary updates
  const prevCombinedRef = useRef<string>('');

  // Update manual text when prop changes
  useEffect(() => {
    setManualTextValue(manualText);
  }, [manualText]);

  // Combine all inputs: prompt1, prompt2, dynamic text inputs, and manual text
  useEffect(() => {
    const parts: string[] = [];
    
    if (prompt1 && prompt1.trim()) parts.push(prompt1.trim());
    if (prompt2 && prompt2.trim()) parts.push(prompt2.trim());
    
    // Add text from dynamic ports
    textInputs.forEach(text => {
      if (text && text.trim()) {
        parts.push(text.trim());
      }
    });
    
    // Add manual text
    if (manualTextValue && manualTextValue.trim()) {
      parts.push(manualTextValue.trim());
    }

    const combined = parts.join(' ');
    
    // Only update if the combined value actually changed
    if (combined !== prevCombinedRef.current && onUpdate) {
      prevCombinedRef.current = combined;
      onUpdate({ 
        content: combined,
        manualText: manualTextValue
      });
    }
  }, [prompt1, prompt2, textInputs, manualTextValue, onUpdate]);

  const handleManualTextChange = (value: string) => {
    setManualTextValue(value);
  };

  const handleAddTextInputPort = () => {
    if (onUpdate) {
      const newCount = (textInputPortCount || 0) + 1;
      onUpdate({ 
        panelSettings: { 
          textInputPortCount: newCount 
        } 
      });
    }
  };

  const handleRemoveTextInputPort = () => {
    if (onUpdate && textInputPortCount > 0) {
      const newCount = textInputPortCount - 1;
      onUpdate({ 
        panelSettings: { 
          textInputPortCount: newCount 
        } 
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-[320px]">
      <div className="flex flex-col gap-4">
        {/* Prompt Inputs Display (always visible at top) */}
        <div className="flex flex-col gap-2">
          <div className="rounded-xl bg-[#161719] border border-white/5 p-4 shadow-inner">
            <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">Prompt 1</div>
            <textarea 
              className="w-full h-20 resize-none bg-transparent text-[14px] leading-relaxed text-gray-300 placeholder-gray-600 outline-none"
              placeholder="Connect a prompt input"
              value={prompt1 || ''}
              readOnly
            />
          </div>
          <div className="rounded-xl bg-[#161719] border border-white/5 p-4 shadow-inner">
            <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">Prompt 2</div>
            <textarea 
              className="w-full h-20 resize-none bg-transparent text-[14px] leading-relaxed text-gray-300 placeholder-gray-600 outline-none"
              placeholder="Connect a prompt input"
              value={prompt2 || ''}
              readOnly
            />
          </div>
        </div>

        {/* Combined Prompt Title */}
        <div className="text-[10px] font-medium text-gray-500 uppercase">
          Combined Prompt
        </div>

        {/* Single Manual Text Input */}
        <div className="rounded-xl bg-[#161719] border border-white/5 p-4 shadow-inner">
          <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">Text</div>
          <textarea 
            className="w-full h-20 resize-none bg-transparent text-[14px] leading-relaxed text-gray-300 placeholder-gray-600 outline-none"
            placeholder="Write additional text"
            value={manualTextValue}
            onChange={(e) => handleManualTextChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <button 
          onClick={handleAddTextInputPort}
          className="flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-white transition-colors px-1"
        >
          <span className="text-lg">+</span> Add another text input
        </button>
        {textInputPortCount > 0 && (
          <button 
            onClick={handleRemoveTextInputPort}
            className="flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-red-400 transition-colors px-1"
          >
            <span className="text-lg">−</span> Remove text input port
          </button>
        )}
      </div>
    </div>
  );
};
