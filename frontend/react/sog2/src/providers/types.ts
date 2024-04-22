import { Dispatch, SetStateAction } from 'react';

import { FreeSlideDialogContent } from '../components/FreeSlideDialog';
import { AudioMapping, BibleBook, InputMaybe, Query, Sermon, Slide, SlideMappingInput } from '../utils/gql/types';

export interface ChapterSelector {
  bookIdx?: number;
  chapterId?: number;
}

export interface PresentationData {
  text: string;
  title: string;
}

export interface SlideData {
  slide: Slide;
  presentationData: PresentationData;
  slideAudioMapping?: InputMaybe<SlideMappingInput>;
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
  sermonsData?: Sermon[];
  handleSermonSelect: (id: string) => void;
  currentSermon?: Sermon;
  audioMapping?: AudioMapping;
}

export interface PlayerContextType {
  seek: (value: number | number[]) => void;
  setAudio: (src: string, title: string, played?: number) => void;
  handlePlayPause: () => void;
  setOpenInterface: Dispatch<SetStateAction<boolean>>;
  src: string | null;
  title: string;
  played: number;
  duration: number;
  isPlaying: boolean;
  openInterface: boolean;
}

export interface MultiScreenDataProviderContextType {
  setScreensCount: (newScreenCount: number | null) => void;
  isFirstScreen: () => boolean;
  isLastScreen: () => boolean;
  currentScreen: number;
  screensCount: null | number;
  requestNextScreen: () => void;
  requestPrevScreen: () => void;
  resetScreens: () => void;
  setLastUp: () => void;
  setLastDown: () => void;
  proposeNewRatio: (newRatio: number) => void;
  ratio: number;
}
