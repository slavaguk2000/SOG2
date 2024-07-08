import React, { FC, PropsWithChildren, useState } from 'react';

import { PreviewScreensData, ScreenSize } from '../types';

import MainScreenSegmentationDataProviderContext from './context';

const MainScreenRatioProvider: FC<PropsWithChildren> = ({ children }) => {
  const [lastUp, setLastUp] = useState(false);
  const [previewScreensData, setPreviewScreensData] = useState<PreviewScreensData | null>(null);
  const [screenSize, setScreenSize] = useState<null | ScreenSize>(null);

  const proposeNewScreenSize = (newScreenSize: ScreenSize) => {
    setScreenSize(newScreenSize);
  };

  const proposePreviewScreensData = (newPreviewScreensData: PreviewScreensData) => {
    if (newPreviewScreensData.screensCount < 2) {
      setPreviewScreensData(null);
    }

    setPreviewScreensData(newPreviewScreensData);
  };

  const setCurrentScreen = (newScreen: number) => {
    setPreviewScreensData(
      (prev) =>
        prev && {
          ...prev,
          currentScreen: Math.min(Math.max(0, newScreen), prev.screensCount - 1),
        },
    );
  };

  const screensCount = previewScreensData?.screensCount ?? 1;
  const currentScreen = previewScreensData?.currentScreen ?? 0;

  const isFirstScreen = (): boolean => {
    if (!previewScreensData) {
      return true;
    }

    return currentScreen <= 0;
  };

  const isLastScreen = (): boolean => {
    if (!previewScreensData) {
      return true;
    }

    return currentScreen >= screensCount - 1;
  };

  const requestNextScreen = () =>
    new Promise<number>((resolve, reject) => {
      setPreviewScreensData((prev) => {
        if (prev) {
          const currentScreen =
            screensCount > 1 ? (prev.currentScreen + 1 < screensCount ? prev.currentScreen + 1 : screensCount - 1) : 0;

          resolve(Math.min(currentScreen / prev.screensCount, 1));

          return {
            ...prev,
            currentScreen,
          };
        }

        reject();
        return prev;
      });
    });

  const requestPrevScreen = () => {
    setPreviewScreensData(
      (prev) =>
        prev && {
          ...prev,
          currentScreen: prev.screensCount && prev.currentScreen > 0 ? prev.currentScreen - 1 : 0,
        },
    );
  };

  const resetScreens = () => {
    setPreviewScreensData(null);
  };

  const handleLastUp = () => {
    setLastUp(true);
  };

  const handleLastDown = () => {
    setLastUp(false);
  };

  return (
    <MainScreenSegmentationDataProviderContext.Provider
      value={{
        mainScreenSize: screenSize,
        previewScreensData,
        proposeNewScreenSize,
        proposePreviewScreensData,
        setCurrentScreen,
        isFirstScreen,
        isLastScreen,
        requestNextScreen,
        requestPrevScreen,
        resetScreens,
        setLastUp: handleLastUp,
        setLastDown: handleLastDown,
        screensCount,
        currentScreen,
        multiScreenMode: screensCount > 1,
        lastUp,
      }}
    >
      {children}
    </MainScreenSegmentationDataProviderContext.Provider>
  );
};

export default MainScreenRatioProvider;
