import { useEffect, useRef } from "react";

export function useKeyPress(key: string, handler: (evt: Event) => void) {
  const eventListenerRef = useRef<(evt: KeyboardEvent) => void>();

  useEffect(() => {
    eventListenerRef.current = (event: KeyboardEvent) => {
      if (event.key === key) {
        handler?.(event);
      }
    };
  }, [key, handler]);

  useEffect(() => {
    const eventListener = (event: Event) => {
      eventListenerRef.current?.(event as KeyboardEvent);
    };
    window.addEventListener("keydown", eventListener);
    return () => {
      window.removeEventListener("keydown", eventListener);
    };
  }, []);
}
