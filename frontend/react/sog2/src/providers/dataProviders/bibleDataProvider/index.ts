import { useContext } from 'react';

import BibleContext from './context';

export const useBibleData = () => {
  return useContext(BibleContext);
};
