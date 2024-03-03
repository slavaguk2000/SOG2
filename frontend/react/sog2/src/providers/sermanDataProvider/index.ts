import { useContext } from 'react';

import SermonDataProviderContext from './context';

export const useSermonData = () => {
  return useContext(SermonDataProviderContext);
};
