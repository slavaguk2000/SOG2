import { Dispatch, SetStateAction } from 'react';

import { FreeSlideDialogContent } from '../components/FreeSlideDialog';
import {
  AudioMapping,
  BibleBook,
  InputMaybe,
  Maybe,
  MusicalKey,
  Psalm,
  PsalmsBook,
  Query,
  Sermon,
  Slide,
  SlideMappingInput,
} from '../utils/gql/types';

export interface ChapterSelector {
  bookIdx?: number;
  chapterId?: number;
}

export interface PresentationData {
  text: string;
  title: string;
  multiScreenShow?: boolean;
}

export interface SegmentationData {
  screensCount: number;
  currentScreen: number;
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

export interface SearchContextType {
  handleSelectSlide: (slide: Slide) => void;
  handleSelectPlace: (slide: Slide) => void;
  clearSearchLine: () => void;
  options: Slide[];
  hasResults: boolean;
  searchText: string;
  setSearchText: (newValue: string) => void;
  // TODO : remove from here to another provider
  handleUpdateSlide: (slide: Slide) => void;
  handleUpdateLocation: (slide: Slide) => void;
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

export interface PsalmData extends Psalm {
  tonality?: Maybe<MusicalKey>;
  transposition: number;
}

export interface PsalmsDataSelectContextType {
  psalmsBookId: string;
  favouritePsalmsBookId?: string;
  setFavouritePsalmsBookId: (newId?: string) => void;
}

export interface PsalmsBooksContextType {
  psalmsBookId: string;
  psalmsBooksData?: Query['psalmsBooks'];
  handlePsalmsBookSelect: (selectedId: string) => void;
  currentPsalmBook?: PsalmsBook;
  selectPsalmBookWithPsalms: () => void;
}

export interface PsalmsContextType {
  psalmsData?: Array<PsalmData>;
  dataLength: number;
  psalmsQueryDataLoading: boolean;
}

export interface CurrentPsalmContextType extends DataProvider {
  psalmId?: string;
  currentPsalm?: Psalm;
  handlePsalmSelect: (selectedId: string) => void;
  clearPsalmSelect: () => void;
  psalmData?: Query['psalm'];
}

export interface FavouriteContextType {
  favouritePsalmsDataMap: Record<string, boolean | undefined>;
  favouriteReady: boolean;
  handlePsalmsReorder: (ids: string[]) => void;
  favouritePsalmsData: Array<PsalmData>;
}

export interface PresentationContextType {
  setText: (text: string, location: string, options?: { currentLastUp?: boolean; multiScreenShow?: boolean }) => void;
  captureTextScreen: () => void;
  releaseTextScreen: () => void;
  validTextSession: boolean;
  captureChordScreen: () => void;
  releaseChordScreen: () => void;
  validChordSession: boolean;
}

export interface FreeSlideDialogContextType {
  setOpen: Dispatch<SetStateAction<boolean>>;
  openWithFreeSlide: (content: FreeSlideDialogContent) => void;
}

export interface InstrumentsFieldProviderContextType {
  silentMode: boolean;
  setSilentMode: Dispatch<SetStateAction<boolean>>;
  handleUpdateSlide: (newSlide?: SlideData, options?: { currentLastUp?: boolean }) => void;
  handleUpdateCurrentSlideOffset: (screenOffset: number, timePoint: number) => void;
  currentSlide?: Slide;
}

export interface SermonDataProviderContextType extends DataProvider {
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

export interface PreviewScreensData {
  screensCount: number;
  fontSize: number;
  viewHeight: number;
  viewWidth: number;
  overlay: number;
  currentScreen: number;
}

export interface ScreenSize {
  width: number;
  height: number;
}

export interface MainScreenSegmentationDataProviderContextType {
  mainScreenSize: ScreenSize | null;
  proposeNewScreenSize: (screenSize: ScreenSize) => void;
  setCurrentScreen: (newScreen: number) => void;
  currentScreen: number;
  screensCount: number;
  multiScreenMode: boolean;
  proposePreviewScreensData: (newPreviewScreensData: PreviewScreensData) => void;
  previewScreensData: PreviewScreensData | null;
  isFirstScreen: () => boolean;
  isLastScreen: () => boolean;
  requestNextScreen: () => Promise<number>;
  requestPrevScreen: () => void;
  resetScreens: () => void;
  setLastUp: () => void;
  setLastDown: () => void;
  lastUp: boolean;
}

export interface AudioMappingProviderContextType {
  follow: boolean;
  setFollow: Dispatch<SetStateAction<boolean>>;
  recording: boolean;
  setRecording: Dispatch<SetStateAction<boolean>>;
}

export interface SermonsContextType {
  sermons?: Sermon[];
  dataLength: number;
  preparedSermons?: {
    id: string;
    name: string;
  }[];
}
