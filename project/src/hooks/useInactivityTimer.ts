import { useEffect, useCallback } from 'react';

export const useInactivityTimer = (timeout: number, onInactive: () => void) => {
  const resetTimer = useCallback(() => {
    const existingTimer = window.localStorage.getItem('inactivityTimer');
    if (existingTimer) {
      window.clearTimeout(parseInt(existingTimer));
    }

    const newTimer = window.setTimeout(() => {
      onInactive();
    }, timeout);

    window.localStorage.setItem('inactivityTimer', newTimer.toString());
  }, [timeout, onInactive]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    resetTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      const existingTimer = window.localStorage.getItem('inactivityTimer');
      if (existingTimer) {
        window.clearTimeout(parseInt(existingTimer));
      }
    };
  }, [resetTimer]);
};