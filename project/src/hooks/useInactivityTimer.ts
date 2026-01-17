import { useEffect, useCallback, useRef } from 'react';

export const useInactivityTimer = (timeout: number, onInactive: () => void) => {
  const timerRef = useRef<number>();

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      onInactive();
    }, timeout);
  }, [timeout, onInactive]);

  useEffect(() => {
    const handleActivity = () => {
      resetTimer();
    };

    // Use passive event listeners for better performance
    const options = { passive: true };
    window.addEventListener('mousedown', handleActivity, options);
    window.addEventListener('keydown', handleActivity, options);
    window.addEventListener('touchstart', handleActivity, options);

    resetTimer();

    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [resetTimer]);
};