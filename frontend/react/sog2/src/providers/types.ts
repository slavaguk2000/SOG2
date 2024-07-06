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

interface PsalmData extends Psalm {
  tonality?: Maybe<MusicalKey>;
  transposition: number;
}

export interface PsalmsContextType extends DataProvider {
  psalmsBookId: string;
  psalmId: string;
  psalmsBooksData?: Query['psalmsBooks'];
  psalmsData?: Array<PsalmData>;
  psalmData?: Query['psalm'];
  handlePsalmSelect: (selectedId: string, transposition?: number) => void;
  handlePsalmBookSelect: (selectedId: string) => void;
  handlePsalmsReorder: (ids: string[]) => void;
  currentPsalm?: Psalm;
  currentPsalmBook?: PsalmsBook;
  psalmsQueryDataLoading: boolean;
  dataLength: number;
}

export interface FavouriteContextType {
  favouritePsalmsBookId?: string;
  favouritePsalmsDataMap: Record<string, boolean | undefined>;
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
