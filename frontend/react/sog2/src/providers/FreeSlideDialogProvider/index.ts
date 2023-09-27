import { useContext } from 'react';

import FreeSlideDialogContext from './context';

export const useFreeSlideDialog = () => {
  return useContext(FreeSlideDialogContext);
};
