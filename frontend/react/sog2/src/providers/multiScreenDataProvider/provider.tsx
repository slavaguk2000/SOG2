import React, { FC, PropsWithChildren, useState } from 'react';

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
  const [ratio, setRatio] = useState(4 / 3);

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

  const proposeNewRatio = (newRatio: number) => {
    setRatio(newRatio);
    console.log(`New ratio: ${newRatio}`);
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
        proposeNewRatio,
        ratio,
      }}
    >
      {children}
    </MultiScreenDataProviderContext.Provider>
  );
};

export default MultiScreenDataProvider;
