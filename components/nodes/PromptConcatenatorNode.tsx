
import React from 'react';

export const PromptConcatenatorNode: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 min-h-[320px]">
      <div className="flex flex-col gap-4">
        {/* Input Text Area 1 */}
        <div className="rounded-xl bg-[#161719] border border-white/5 p-4 shadow-inner">
          <textarea 
            className="w-full h-24 resize-none bg-transparent text-[14px] leading-relaxed text-gray-300 placeholder-gray-600 outline-none"
            placeholder="Connect multiple prompts to one output prompt."
          />
        </div>

        {/* Input Text Area 2 */}
        <div className="rounded-xl bg-[#161719] border border-white/5 p-4 shadow-inner">
          <textarea 
            className="w-full h-24 resize-none bg-transparent text-[14px] leading-relaxed text-gray-300 placeholder-gray-600 outline-none"
            placeholder="Write additional text"
          />
        </div>
      </div>

      <button className="flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-white transition-colors px-1 mt-auto">
        <span className="text-lg">+</span> Add another text input
      </button>
    </div>
  );
};
