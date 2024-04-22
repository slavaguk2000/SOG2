import { createContext } from 'react';

import { MultiScreenDataProviderContextType } from '../types';

const defaultValue: MultiScreenDataProviderContextType = {
  setScreensCount: () => true,
  isFirstScreen: () => true,
  isLastScreen: () => true,
  currentScreen: 0,
  requestNextScreen: () => true,
  requestPrevScreen: () => true,
  screensCount: null,
  resetScreens: () => true,
  setLastUp: () => true,
  setLastDown: () => true,
  proposeNewRatio: () => true,
  ratio: 4 / 3,
};

const MultiScreenDataProviderContext = createContext<MultiScreenDataProviderContextType>(defaultValue);

MultiScreenDataProviderContext.displayName = 'MultiScreenDataProviderContext';

export default MultiScreenDataProviderContext;
