import { createContext } from 'react';

import { MainScreenSegmentationDataProviderContextType } from '../types';

const defaultValue: MainScreenSegmentationDataProviderContextType = {
  currentScreen: 0,
  multiScreenMode: false,
  screensCount: 1,
  requestNextScreen: () => true,
  requestPrevScreen: () => true,
  resetScreens: () => true,
  proposeNewScreenSize: () => true,
  proposePreviewScreensData: () => true,
  previewScreensData: null,
  mainScreenSize: null,
  setCurrentScreen: () => true,
  isFirstScreen: () => true,
  isLastScreen: () => true,
  setLastUp: () => true,
  setLastDown: () => true,
  lastUp: false,
};

const MainScreenSegmentationDataProviderContext =
  createContext<MainScreenSegmentationDataProviderContextType>(defaultValue);

MainScreenSegmentationDataProviderContext.displayName = 'MainScreenSegmentationDataProviderContext';

export default MainScreenSegmentationDataProviderContext;
