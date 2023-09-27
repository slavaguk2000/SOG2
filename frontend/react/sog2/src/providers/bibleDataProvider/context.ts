import { createContext } from 'react';

import { BibleContextType } from '../types';

const defaultValue: BibleContextType = {
  bibleId: '0',
  currentChapter: {
    bookIdx: undefined,
    chapterId: undefined,
  },
  currentBook: undefined,
  setCurrentChapter: () => true,
  currentSlide: undefined,
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
