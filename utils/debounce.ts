// Debounce utility function with cancel and flush support

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;

  const cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    lastArgs = null;
  };

  const flush = () => {
    if (timeout && lastArgs) {
      clearTimeout(timeout);
      timeout = null;
      func(...lastArgs);
      lastArgs = null;
    }
  };

  const executedFunction = (...args: Parameters<T>) => {
    lastArgs = args;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
      lastArgs = null;
    }, wait);
  };

  executedFunction.cancel = cancel;
  executedFunction.flush = flush;

  return executedFunction as DebouncedFunction<T>;
}
