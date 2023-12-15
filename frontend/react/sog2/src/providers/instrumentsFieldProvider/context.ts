import { createContext } from 'react';

import { InstrumentsFieldProviderContextType } from '../types';

const defaultValue: InstrumentsFieldProviderContextType = {
  handleUpdateSlide: () => true,
  silentMode: false,
  setSilentMode: () => true,
};

const InstrumentsFieldProviderContext = createContext<InstrumentsFieldProviderContextType>(defaultValue);

InstrumentsFieldProviderContext.displayName = 'InstrumentsFieldProviderContext';

export default InstrumentsFieldProviderContext;
