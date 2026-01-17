
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ArrayNodeProps {
  inputText?: string;
  onUpdate?: (data: any) => void;
}

export const ArrayNode: React.FC<ArrayNodeProps> = ({ inputText, onUpdate }) => {
  const [items, setItems] = useState<Array<{ id: number; value: string }>>([{ id: 1, value: "" }]);

  // When inputText changes (from connected node), add it to the array
  useEffect(() => {
    if (inputText && inputText.trim() !== '') {
      setItems(prevItems => {
        // Check if this text is already in the array
        const exists = prevItems.some(item => item.value === inputText.trim());
        if (!exists) {
          const newItem = { id: Date.now(), value: inputText.trim() };
          const updatedItems = [...prevItems, newItem];
          // Update node data
          if (onUpdate) {
            onUpdate({ arrayItems: updatedItems.map(item => item.value) });
          }
          return updatedItems;
        }
        return prevItems;
      });
    }
  }, [inputText, onUpdate]);

  const addItem = () => {
    const newItem = { id: Date.now(), value: "" };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    if (onUpdate) {
      onUpdate({ arrayItems: updatedItems.map(item => item.value) });
    }
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      if (onUpdate) {
        onUpdate({ arrayItems: updatedItems.map(item => item.value) });
      }
    }
  };

  const updateItem = (id: number, value: string) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, value } : item
    );
    setItems(updatedItems);
    if (onUpdate) {
      onUpdate({ arrayItems: updatedItems.map(item => item.value) });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div className="flex-1 rounded-lg bg-[#161719] border border-white/5 px-4 py-3 shadow-inner">
              <input 
                type="text" 
                placeholder="Array item"
                value={item.value}
                onChange={(e) => updateItem(item.id, e.target.value)}
                className="w-full bg-transparent text-[13px] text-gray-300 placeholder-gray-600 outline-none" 
              />
            </div>
            <button 
              onClick={() => removeItem(item.id)}
              className="p-2 text-gray-600 hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={addItem}
        className="flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-white transition-colors px-1"
      >
        <span className="text-lg">+</span> Add another item
      </button>
    </div>
  );
};
