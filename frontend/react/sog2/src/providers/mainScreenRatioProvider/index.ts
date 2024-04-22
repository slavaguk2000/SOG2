import { useContext } from 'react';

import MainScreenRatioProviderContext from './context';

export const useMainScreenRatio = () => {
  return useContext(MainScreenRatioProviderContext);
};
