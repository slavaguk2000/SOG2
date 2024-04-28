import { useContext } from 'react';

import MainScreenSegmentationDataProviderContext from './context';

export const useMainScreenSegmentationData = () => {
  return useContext(MainScreenSegmentationDataProviderContext);
};
