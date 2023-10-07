import { createContext } from 'react';

import { BibleContextType } from '../types';

const defaultValue: BibleContextType = {
  bibleId: '0',
  currentChapter: {},
  handleChapterSelect: () => true,
  handleUpdateSlide: () => true,
  handleBookSelect: () => true,
  handlePrevSlide: () => true,
  handleNextSlide: () => true,
  silentMode: false,
  setSilentMode: () => true,
};

const BibleContext = createContext<BibleContextType>(defaultValue);

BibleContext.displayName = 'BibleContext';

export default BibleContext;
