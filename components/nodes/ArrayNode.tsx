
import React, { useState } from 'react';
import { X } from 'lucide-react';

export const ArrayNode: React.FC = () => {
  const [items, setItems] = useState([{ id: 1, value: "" }]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), value: "" }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
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
