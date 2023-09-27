import { Dispatch, SetStateAction } from 'react';

import { BibleBook, Query, Slide } from '../utils/gql/types';

export interface ChapterSelector {
  bookIdx?: number;
  chapterId?: number;
}

export interface BibleContextType {
  bibleId: string;
  currentChapter: ChapterSelector;
  currentBook?: BibleBook;
  setCurrentChapter: Dispatch<SetStateAction<ChapterSelector>>;
  bibleBooksData?: BibleBook[];
  versesData?: Pick<Query, 'bibleVerses'>;
  currentSlide?: Slide;
  handleUpdateSlide: (newSlide?: Slide) => void;
  handleBookSelect: (selectedId: string) => void;
  handlePrevSlide: () => void;
  handleNextSlide: () => void;
  silentMode: boolean;
  setSilentMode: Dispatch<SetStateAction<boolean>>;
}

export interface PresentationContextType {
  setText: (text: string, location: string) => void;
  captureTextScreen: () => void;
  releaseTextScreen: () => void;
  validSession: boolean;
}

export interface FreeSlideDialogContextType {
  setOpen: Dispatch<SetStateAction<boolean>>;
}
