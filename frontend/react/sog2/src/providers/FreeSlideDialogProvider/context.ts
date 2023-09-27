import { createContext } from 'react';

import { FreeSlideDialogContextType } from '../types';

const defaultValue: FreeSlideDialogContextType = {
  setOpen: () => true,
};

const FreeSlideDialogContext = createContext<FreeSlideDialogContextType>(defaultValue);

FreeSlideDialogContext.displayName = 'FreeSlideDialogContext';

export default FreeSlideDialogContext;
