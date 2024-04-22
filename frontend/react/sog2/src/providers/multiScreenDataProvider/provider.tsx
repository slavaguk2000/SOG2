import React, { FC, PropsWithChildren, useEffect, useState } from 'react';

import { usePresentation } from '../presentationProvider';

import MultiScreenDataProviderContext from './context';

interface ScreensData {
  screensCount: null | number;
  currentScreen: number;
}

const initialScreensData = {
  screensCount: null,
  currentScreen: 0,
};

const MultiScreenDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [{ screensCount, currentScreen }, setScreensData] = useState<ScreensData>(initialScreensData);
  const [lastUp, setLastUp] = useState(false);

  const { setSegmentation } = usePresentation();

  useEffect(() => {
    if (screensCount && screensCount > 1) {
      setSegmentation({ screensCount, currentScreen });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screensCount, currentScreen]);

  const isFirstScreen = (): boolean => {
    if (screensCount === null) {
      return true;
    }

    return currentScreen <= 0;
  };

  const isLastScreen = (): boolean => {
    if (screensCount === null) {
      return true;
    }

    return currentScreen >= screensCount - 1;
  };

  const requestNextScreen = () => {
    setScreensData((prev) => ({
      screensCount: prev.screensCount,
      currentScreen: prev.screensCount
        ? prev.currentScreen + 1 < prev.screensCount
          ? prev.currentScreen + 1
          : prev.screensCount - 1
        : 0,
    }));
  };

  const requestPrevScreen = () => {
    setScreensData((prev) => ({
      screensCount: prev.screensCount,
      currentScreen: prev.screensCount && prev.currentScreen > 0 ? prev.currentScreen - 1 : 0,
    }));
  };

  const resetScreens = () => {
    setScreensData(initialScreensData);
  };

  const handleLastUp = () => {
    setLastUp(true);
  };

  const handleLastDown = () => {
    setLastUp(false);
  };

  const handleSetScreenCount = (newScreenCount: number | null) => {
    setScreensData((prev) => ({
      screensCount: newScreenCount,
      currentScreen: lastUp && newScreenCount ? newScreenCount - 1 : prev.currentScreen,
    }));
  };

  return (
    <MultiScreenDataProviderContext.Provider
      value={{
        setScreensCount: handleSetScreenCount,
        isFirstScreen,
        isLastScreen,
        currentScreen,
        requestNextScreen,
        requestPrevScreen,
        screensCount,
        resetScreens,
        setLastUp: handleLastUp,
        setLastDown: handleLastDown,
      }}
    >
      {children}
    </MultiScreenDataProviderContext.Provider>
  );
};

export default MultiScreenDataProvider;
