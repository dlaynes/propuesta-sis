import { useState, useCallback, useRef } from 'react';
import { AnnouncerContext } from './AnnouncerContext';

export function AnnouncerProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce = useCallback((msg: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setMessage('');
    timeoutRef.current = setTimeout(() => {
      setMessage(msg);
    }, 150);
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>
    </AnnouncerContext.Provider>
  );
}
