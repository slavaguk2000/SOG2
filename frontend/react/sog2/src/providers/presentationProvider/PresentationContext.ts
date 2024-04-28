import { createContext } from 'react';

import { PresentationContextType } from '../types';

const defaultValue: PresentationContextType = {
  setText: () => true,
  captureTextScreen: () => true,
  releaseTextScreen: () => true,
  validSession: false,
};

export const PresentationContext = createContext<PresentationContextType>(defaultValue);
