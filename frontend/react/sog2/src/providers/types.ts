import { Dispatch, SetStateAction } from 'react';

import { FreeSlideDialogContent } from '../components/FreeSlideDialog';
import { BibleBook, Query, Slide } from '../utils/gql/types';

export interface ChapterSelector {
  bookIdx?: number;
  chapterId?: number;
}

export interface BibleContextType {
  bibleId: string;
  currentChapter: ChapterSelector;
  currentBook?: BibleBook;
  handleChapterSelect: (selectedId: number) => void;
  bibleBooksData?: BibleBook[];
  versesData?: Pick<Query, 'bibleVerses'>;
  currentSlide?: Slide;
  lastSlide?: Slide;
  handleUpdateSlide: (newSlide?: Slide) => void;
  handleUpdateLocation: (newSlide: Slide) => void;
  handleBookSelect: (selectedId: string) => void;
  handlePrevSlide: () => void;
  handleNextSlide: () => void;
  silentMode: boolean;
  setSilentMode: Dispatch<SetStateAction<boolean>>;
  slideInChapter: boolean;
  getReadableBiblePlace: (slide: Slide, withVerse?: boolean) => string;
}

export interface PresentationContextType {
  setText: (text: string, location: string) => void;
  captureTextScreen: () => void;
  releaseTextScreen: () => void;
  validSession: boolean;
}

export interface FreeSlideDialogContextType {
  setOpen: Dispatch<SetStateAction<boolean>>;
  openWithFreeSlide: (content: FreeSlideDialogContent) => void;
}
