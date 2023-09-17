import { Dispatch, SetStateAction } from 'react';

import { BibleBook, Slide } from '../utils/gql/types';

export interface ChapterSelector {
  bookIdx?: number;
  chapterId?: number;
}

export interface BibleContextType {
  bibleId: string;
  currentChapter: ChapterSelector;
  setCurrentChapter: Dispatch<SetStateAction<ChapterSelector>>;
  bibleBooksData?: BibleBook[];
  currentSlide?: Slide;
  handleUpdateSlide: (newSlide: Slide) => void;
  handleBookSelect: (selectedId: string) => void;
}
