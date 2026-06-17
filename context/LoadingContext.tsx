import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
  } from "react";

  interface LoadingContextValue {
    isLoading: boolean;
    showLoader: (durationMs?: number) => void;
    hideLoader: () => void;
  }

  const LoadingContext = createContext<LoadingContextValue>({
    isLoading: false,
    showLoader: () => {},
    hideLoader: () => {},
  });

  export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const hideLoader = useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsLoading(false);
    }, []);

    const showLoader = useCallback((durationMs = 700) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsLoading(true);
      timerRef.current = setTimeout(() => setIsLoading(false), durationMs);
    }, []);

    return (
      <LoadingContext.Provider value={{ isLoading, showLoader, hideLoader }}>
        {children}
      </LoadingContext.Provider>
    );
  }

  export function useLoader() {
    return useContext(LoadingContext);
  }
  