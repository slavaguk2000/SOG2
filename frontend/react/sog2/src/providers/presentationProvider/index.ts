import { useContext } from 'react';

import { PresentationContext } from './PresentationContext';

export const usePresentation = () => {
  return useContext(PresentationContext);
};
