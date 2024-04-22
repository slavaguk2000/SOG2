import { createContext } from 'react';

import { MainScreenRatioProviderContextType } from '../types';

const defaultValue: MainScreenRatioProviderContextType = {
  proposeNewRatio: () => true,
  ratio: 4 / 3,
};

const MainScreenRatioProviderContext = createContext<MainScreenRatioProviderContextType>(defaultValue);

MainScreenRatioProviderContext.displayName = 'MainScreenRatioProviderContext';

export default MainScreenRatioProviderContext;
