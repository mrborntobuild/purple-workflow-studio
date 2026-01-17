import React from 'react';
import { motion } from 'framer-motion';

export const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => {
  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-12 md:px-24 lg:w-1/2 bg-[#050506] text-white z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md"
        >
          {/* Logo Placeholder */}
          <div className="mb-12 h-12 w-12 rounded-full bg-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.5)]" />
          
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-white">{title}</h1>
            <p className="mt-3 text-base text-gray-400">{subtitle}</p>
          </div>
          
          {children}
        </motion.div>
      </div>

      {/* Right Side - Visual/Art */}
      <div className="hidden w-1/2 lg:flex relative bg-[#0e0e11] overflow-hidden items-center justify-center">
        {/* Abstract Gradient Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
        
        {/* Placeholder for the "AI Generated Video" preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 aspect-[9/16] w-[320px] rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated pulsing circle */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent opacity-50" />
          
          <div className="z-10 text-center p-6">
             <div className="w-20 h-20 bg-white/5 rounded-full mx-auto mb-6 flex items-center justify-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
             </div>
             <h3 className="text-lg font-medium text-white mb-2">AI-Generated Video</h3>
             <p className="text-sm text-gray-500">Video will be displayed here</p>
          </div>
          
          {/* Floating UI elements decoration */}
          <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shadow-lg">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
