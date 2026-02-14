
import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadFileToStorage } from '../../services/fileStorage';
import { LazyImage } from './LazyImage';

interface ImportNodeProps {
  content: string;
  imageUrl?: string;
  onUpdate: (data: any) => void;
  workflowId?: string; // Add workflowId prop
  nodeId?: string; // Add nodeId prop
}

export const ImportNode: React.FC<ImportNodeProps> = ({ 
  content, 
  imageUrl, 
  onUpdate,
  workflowId = 'temp', // Default to 'temp' for unsaved workflows
  nodeId = 'unknown' // Default nodeId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      console.warn('⚠️ [ImportNode] Invalid file type:', file?.type);
      return;
    }

    setIsUploading(true);
    
    try {
      // Show base64 preview immediately for better UX
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Result = reader.result as string;
        
        // Update with base64 preview first (for immediate feedback)
        onUpdate({ 
          imageUrl: base64Result, 
          content: base64Result,
          status: 'loading' // Optional: add loading state
        });

        try {
          // Upload to Supabase Storage
          const { url } = await uploadFileToStorage(file, workflowId, nodeId);
          
          // Update with storage URL (replaces base64)
          onUpdate({ 
            imageUrl: url, 
            content: url,
            status: 'success'
          });
          
          console.log('✅ [ImportNode] File uploaded and saved:', url);
        } catch (uploadError) {
          console.error('❌ [ImportNode] Failed to upload file:', uploadError);
          // Keep base64 as fallback if upload fails
          onUpdate({ 
            imageUrl: base64Result, 
            content: base64Result,
            status: 'error'
          });
          // Optionally show error message to user
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('❌ [ImportNode] Error reading file:', error);
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so selecting the same file again triggers onChange
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ imageUrl: undefined, content: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div 
        className={`group/upload relative flex aspect-square w-full flex-col items-center justify-center rounded-xl overflow-hidden cursor-pointer transition-all ${
          isDragging ? 'border-2 border-purple-500 bg-purple-500/10' : 'border border-white/5'
        } ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
        style={{
          backgroundColor: imageUrl ? 'transparent' : '#1a1b1e',
          backgroundImage: imageUrl ? 'none' : `
            linear-gradient(45deg, #25262b 25%, transparent 25%),
            linear-gradient(-45deg, #25262b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #25262b 75%),
            linear-gradient(-45deg, transparent 75%, #25262b 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isUploading}
        />
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="text-purple-500 animate-spin" />
              <span className="text-xs text-gray-300">Uploading...</span>
            </div>
          </div>
        )}
        
        {imageUrl && !isUploading ? (
          <div className="relative w-full h-full group">
            <LazyImage
              src={imageUrl}
              alt="Imported"
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ) : !isUploading ? (
          <div className="flex flex-col items-center justify-center gap-3 transition-transform group-hover/upload:scale-105">
            <Upload size={32} className="text-gray-400" strokeWidth={1.5} />
            <span className="text-sm font-medium text-gray-200">Drag & drop or click to upload</span>
          </div>
        ) : null}
      </div>
      <div className="rounded-lg bg-[#1a1b1e] border border-white/5 px-3 py-2">
        <input 
          type="text"
          placeholder="Paste a file link"
          className="w-full bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none"
          value={content}
          onChange={(e) => {
            const value = e.target.value;
            onUpdate({ content: value, imageUrl: value.startsWith('http') || value.startsWith('data:') ? value : undefined });
          }}
        />
      </div>
    </div>
  );
};
