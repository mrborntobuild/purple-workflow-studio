import { useRef, useCallback, useEffect } from 'react';

const DEFAULT_MIN_HEIGHT = 80;

export interface UseAutoResizeTextareaOptions {
  minHeight?: number;
}

/**
 * Hook to make a textarea grow with its content — no cap, shows all text.
 */
export function useAutoResizeTextarea(
  value: string,
  options: UseAutoResizeTextareaOptions = {}
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { minHeight = DEFAULT_MIN_HEIGHT } = options;

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = `${minHeight}px`;
    const scrollH = el.scrollHeight;
    el.style.height = `${Math.max(minHeight, scrollH)}px`;
    el.style.overflowY = 'hidden';
  }, [minHeight]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return { ref, resize };
}
