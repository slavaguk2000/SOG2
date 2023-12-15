import { useContext } from 'react';

import InstrumentsFieldProviderContext from './context';

export const useInstrumentsField = () => {
  return useContext(InstrumentsFieldProviderContext);
};
