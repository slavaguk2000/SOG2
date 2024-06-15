import { createContext } from 'react';

import { PresentationContextType } from '../types';

const defaultValue: PresentationContextType = {
  setText: () => true,
  captureTextScreen: () => true,
  releaseTextScreen: () => true,
  validTextSession: false,
  captureChordScreen: () => true,
  releaseChordScreen: () => true,
  validChordSession: false,
};

export const PresentationContext = createContext<PresentationContextType>(defaultValue);
