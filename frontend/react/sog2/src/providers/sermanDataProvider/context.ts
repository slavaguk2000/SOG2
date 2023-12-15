import { createContext } from 'react';

import { SermonDataProviderContextType } from '../types';

const defaultValue: SermonDataProviderContextType = {
  a: true,
};

const SermonDataProviderContext = createContext<SermonDataProviderContextType>(defaultValue);

SermonDataProviderContext.displayName = 'SermonDataProviderContext';

export default SermonDataProviderContext;
