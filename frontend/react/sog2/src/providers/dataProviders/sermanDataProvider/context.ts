import { createContext } from 'react';

import { SermonDataProviderContextType } from '../../types';

const defaultValue: SermonDataProviderContextType = {
  handleNextSlide: () => true,
  handlePrevSlide: () => true,
  handleUpdateSlide: () => true,
  handleUpdateLocation: () => true,
  handleSermonSelect: () => true,
};

const SermonDataProviderContext = createContext<SermonDataProviderContextType>(defaultValue);

SermonDataProviderContext.displayName = 'SermonDataProviderContext';

export default SermonDataProviderContext;
