import { Dispatch, SetStateAction } from 'react';

import { FreeSlideDialogContent } from '../components/FreeSlideDialog';
import { BibleBook, Query, Slide } from '../utils/gql/types';

export interface ChapterSelector {
  bookIdx?: number;
  chapterId?: number;
}

export interface SlideData {
  slide: Slide;
  presentationData: {
    text: string;
    title: string;
  };
}

export interface DataProvider {
  lastSlide?: Slide;
  handlePrevSlide: () => void;
  handleNextSlide: () => void;
  handleUpdateSlide: (newSlide?: Slide) => void;
  handleUpdateLocation: (newSlide: Slide) => void;
}

export interface BibleContextType extends DataProvider {
  bibleId: string;
  currentChapter: ChapterSelector;
  currentBook?: BibleBook;
  handleChapterSelect: (selectedId: number) => void;
  bibleBooksData?: BibleBook[];
  versesData?: Pick<Query, 'bibleVerses'>;
  handleBookSelect: (selectedId: string) => void;
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

export interface InstrumentsFieldProviderContextType {
  silentMode: boolean;
  setSilentMode: Dispatch<SetStateAction<boolean>>;
  handleUpdateSlide: (newSlide?: SlideData) => void;
  currentSlide?: Slide;
}

export interface SermonDataProviderContextType extends DataProvider {
  currentSermonSlides?: Slide[];
}
