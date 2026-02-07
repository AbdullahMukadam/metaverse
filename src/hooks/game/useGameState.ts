import { useState, useCallback } from 'react';

interface LoadingStates {
  initializing: boolean;
  connectingSocket: boolean;
  loadingAssets: boolean;
  ready: boolean;
}

export function useGameState() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitionShowed, setIsTransitionShowed] = useState(false);
  const [isUserEnteredMusicZone, setIsUserEnteredMusicZone] = useState(false);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    initializing: true,
    connectingSocket: false,
    loadingAssets: false,
    ready: false,
  });

  const updateLoadingState = useCallback((updates: Partial<LoadingStates>) => {
    setLoadingStates(prev => ({ ...prev, ...updates }));
  }, []);

  const getLoadingMessage = useCallback(() => {
    if (loadingStates.initializing) return "Initializing...";
    if (loadingStates.connectingSocket) return "Connecting to server...";
    if (loadingStates.loadingAssets) return "Loading game assets...";
    return "";
  }, [loadingStates]);

  const isLoading = !loadingStates.ready;

  return {
    isOpen,
    setIsOpen,
    isTransitionShowed,
    setIsTransitionShowed,
    isUserEnteredMusicZone,
    setIsUserEnteredMusicZone,
    loadingStates,
    updateLoadingState,
    getLoadingMessage,
    isLoading,
  };
}
