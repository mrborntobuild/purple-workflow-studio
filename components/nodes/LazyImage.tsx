import React, { useState, useEffect } from 'react';

interface LazyImageProps {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  draggable?: boolean;
}

export const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt = '', 
  className = '', 
  style,
  onLoad,
  onError,
  draggable = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);

  useEffect(() => {
    if (src !== imageSrc) {
      setIsLoading(true);
      setHasError(false);
      setImageSrc(src);
    }
  }, [src, imageSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  if (!src) {
    return null;
  }

  return (
    <div className="relative w-full h-full">
      {/* Gray loading placeholder */}
      {isLoading && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundColor: '#2a2a2a',
            ...style
          }}
        />
      )}
      
      {/* Actual image with fade-in */}
      <img
        src={src}
        alt={alt}
        draggable={draggable}
        className={`${className} transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
