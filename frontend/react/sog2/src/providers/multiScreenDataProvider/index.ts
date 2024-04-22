import { useContext } from 'react';

import MultiScreenDataProviderContext from './context';

export const useMultiScreenDataProvider = () => {
  return useContext(MultiScreenDataProviderContext);
};
