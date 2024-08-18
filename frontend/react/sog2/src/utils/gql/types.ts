export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AudioMapping = {
  __typename?: 'AudioMapping';
  audioLink: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type BibleBook = {
  __typename?: 'BibleBook';
  chapterCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Couplet = {
  __typename?: 'Couplet';
  coupletContent: Array<CoupletContent>;
  id: Scalars['ID']['output'];
  initialOrder: Scalars['Int']['output'];
  marker: Scalars['String']['output'];
  styling: Scalars['Int']['output'];
};

export type CoupletContent = {
  __typename?: 'CoupletContent';
  chord: CoupletContentChord;
  id: Scalars['ID']['output'];
  line: Scalars['Int']['output'];
  text: Scalars['String']['output'];
};

export type CoupletContentChord = {
  __typename?: 'CoupletContentChord';
  bassNote?: Maybe<Scalars['Int']['output']>;
  chordTemplate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rootNote: Scalars['Int']['output'];
};

export type CoupletContentChordInput = {
  bassNote?: InputMaybe<Scalars['Int']['input']>;
  chordTemplate: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  rootNote: Scalars['Int']['input'];
};

export type CoupletContentInput = {
  chord: CoupletContentChordInput;
  id: Scalars['ID']['input'];
  line: Scalars['Int']['input'];
  text: Scalars['String']['input'];
};

export type CoupletInput = {
  coupletContent: Array<CoupletContentInput>;
  id: Scalars['ID']['input'];
  initialOrder: Scalars['Int']['input'];
  marker: Scalars['String']['input'];
  styling: Scalars['Int']['input'];
};

export type CoupletWithSlide = {
  __typename?: 'CoupletWithSlide';
  couplet: Couplet;
  id: Scalars['ID']['output'];
  slide: Slide;
};

export enum MusicalKey {
  A = 'A',
  ASharp = 'ASharp',
  Ab = 'Ab',
  B = 'B',
  Bb = 'Bb',
  C = 'C',
  CSharp = 'CSharp',
  D = 'D',
  DSharp = 'DSharp',
  Db = 'Db',
  E = 'E',
  Eb = 'Eb',
  F = 'F',
  FSharp = 'FSharp',
  G = 'G',
  GSharp = 'GSharp',
  Gb = 'Gb'
}

export type Mutation = {
  __typename?: 'Mutation';
  addBibleFromSog?: Maybe<Scalars['Boolean']['output']>;
  addPsalmToFavourite?: Maybe<Scalars['Boolean']['output']>;
  addPsalmsFromNavaPiesnJSONPL?: Maybe<Scalars['Boolean']['output']>;
  addPsalmsFromSog?: Maybe<Scalars['Boolean']['output']>;
  deletePsalmsBook?: Maybe<Scalars['Boolean']['output']>;
  importSongImages: Scalars['Boolean']['output'];
  parseSermonsFromBranhamRu?: Maybe<Scalars['Boolean']['output']>;
  removePsalmFromFavourite?: Maybe<Scalars['Boolean']['output']>;
  reorderPsalmsInPsalmsBook: Scalars['Boolean']['output'];
  setActivePsalm?: Maybe<Scalars['Boolean']['output']>;
  setActiveSlide?: Maybe<Scalars['Boolean']['output']>;
  setActiveSlideOffset?: Maybe<Scalars['Boolean']['output']>;
  setFreeSlide?: Maybe<Scalars['Boolean']['output']>;
  syncBibleToElastic?: Maybe<Scalars['Boolean']['output']>;
  syncPsalmsToElastic?: Maybe<Scalars['Boolean']['output']>;
  syncSermonsToElastic?: Maybe<Scalars['Boolean']['output']>;
  updatePsalm: PsalmData;
  updatePsalmTransposition: PsalmsBookItem;
};


export type MutationAddBibleFromSogArgs = {
  language: Scalars['String']['input'];
  sogFileSrc: Scalars['String']['input'];
  translation: Scalars['String']['input'];
};


export type MutationAddPsalmToFavouriteArgs = {
  psalmId: Scalars['ID']['input'];
  transposition?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationAddPsalmsFromNavaPiesnJsonplArgs = {
  fileSrc: Scalars['String']['input'];
  language: Scalars['String']['input'];
};


export type MutationAddPsalmsFromSogArgs = {
  language: Scalars['String']['input'];
  sogFileSrc: Scalars['String']['input'];
};


export type MutationDeletePsalmsBookArgs = {
  psalmsBookId: Scalars['ID']['input'];
};


export type MutationImportSongImagesArgs = {
  psalmsBookId: Scalars['ID']['input'];
};


export type MutationRemovePsalmFromFavouriteArgs = {
  psalmId: Scalars['ID']['input'];
};


export type MutationReorderPsalmsInPsalmsBookArgs = {
  psalmsBookId: Scalars['ID']['input'];
  psalmsIds: Array<Scalars['ID']['input']>;
};


export type MutationSetActivePsalmArgs = {
  psalmId?: InputMaybe<Scalars['ID']['input']>;
  psalmsBookId?: InputMaybe<Scalars['ID']['input']>;
  transposition?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationSetActiveSlideArgs = {
  slideAudioMapping?: InputMaybe<SlideMappingInput>;
  slideId?: InputMaybe<Scalars['ID']['input']>;
  type?: InputMaybe<TabType>;
};


export type MutationSetActiveSlideOffsetArgs = {
  offset: Scalars['Float']['input'];
  slideAudioMapping?: InputMaybe<SlideMappingInput>;
  slideId: Scalars['ID']['input'];
  type: TabType;
};


export type MutationSetFreeSlideArgs = {
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationSyncBibleToElasticArgs = {
  bibleId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationUpdatePsalmArgs = {
  psalmData: PsalmDataInput;
};


export type MutationUpdatePsalmTranspositionArgs = {
  psalmId: Scalars['ID']['input'];
  psalmsBookId: Scalars['ID']['input'];
  transposition: Scalars['Int']['input'];
};

export type Psalm = {
  __typename?: 'Psalm';
  coupletsOrder?: Maybe<Scalars['String']['output']>;
  defaultTonality?: Maybe<MusicalKey>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  psalmNumber?: Maybe<Scalars['String']['output']>;
};

export type PsalmData = {
  __typename?: 'PsalmData';
  couplets: Array<Couplet>;
  id: Scalars['ID']['output'];
  psalm: Psalm;
};

export type PsalmDataInput = {
  couplets: Array<CoupletInput>;
  psalm: PsalmInput;
};

export type PsalmDataWithSlides = {
  __typename?: 'PsalmDataWithSlides';
  couplets: Array<CoupletWithSlide>;
  id: Scalars['ID']['output'];
  psalm: Psalm;
};

export type PsalmInput = {
  coupletsOrder?: InputMaybe<Scalars['String']['input']>;
  defaultTonality?: InputMaybe<MusicalKey>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  psalmNumber?: InputMaybe<Scalars['String']['input']>;
};

export type PsalmsBook = {
  __typename?: 'PsalmsBook';
  iconSrc?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isFavourite?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  psalmsCount: Scalars['Int']['output'];
};

export type PsalmsBookItem = {
  __typename?: 'PsalmsBookItem';
  id: Scalars['ID']['output'];
  psalm: Psalm;
  transpositionSteps: Scalars['Int']['output'];
};

export type PsalmsSorting = {
  sortDirection: SortingDirection;
  sortingKey: PsalmsSortingKeys;
};

export enum PsalmsSortingKeys {
  Name = 'NAME',
  Number = 'NUMBER'
}

export type Query = {
  __typename?: 'Query';
  bibleBooks: Array<BibleBook>;
  bibleHistory: Array<Slide>;
  bibleVerses: Array<Slide>;
  psalm: PsalmDataWithSlides;
  psalms: Array<PsalmsBookItem>;
  psalmsBooks: Array<PsalmsBook>;
  search: Array<Slide>;
  sermon: Array<Slide>;
  sermons: Array<Sermon>;
};


export type QueryBibleBooksArgs = {
  bibleId: Scalars['ID']['input'];
};


export type QueryBibleHistoryArgs = {
  bibleId: Scalars['ID']['input'];
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryBibleVersesArgs = {
  bibleId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
  chapter: Scalars['Int']['input'];
};


export type QueryPsalmArgs = {
  psalmId: Scalars['ID']['input'];
};


export type QueryPsalmsArgs = {
  psalmsBookId: Scalars['ID']['input'];
  psalmsSorting?: InputMaybe<PsalmsSorting>;
};


export type QuerySearchArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  searchPattern: Scalars['String']['input'];
  tabType: TabType;
};


export type QuerySermonArgs = {
  sermonId: Scalars['ID']['input'];
};


export type QuerySermonsArgs = {
  sermonsCollectionId: Scalars['ID']['input'];
};

export type Sermon = {
  __typename?: 'Sermon';
  audioMapping?: Maybe<AudioMapping>;
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  translation: Scalars['String']['output'];
};

export type Slide = {
  __typename?: 'Slide';
  audioMappings?: Maybe<Array<SlideAudioMapping>>;
  content: Scalars['String']['output'];
  contentPrefix?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  location?: Maybe<Array<Scalars['String']['output']>>;
  searchContent?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type SlideAudioMapping = {
  __typename?: 'SlideAudioMapping';
  id?: Maybe<Scalars['ID']['output']>;
  slideCollectionAudioMappingId?: Maybe<Scalars['ID']['output']>;
  spaceOffset?: Maybe<Scalars['Float']['output']>;
  timePoint?: Maybe<Scalars['Int']['output']>;
};

export type SlideLocation = {
  __typename?: 'SlideLocation';
  location: Array<Scalars['String']['output']>;
};

export type SlideMappingInput = {
  slideCollectionAudioMappingId: Scalars['ID']['input'];
  timePoint: Scalars['Int']['input'];
};

export enum SortingDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type SubscriptingPsalmData = {
  __typename?: 'SubscriptingPsalmData';
  psalmData?: Maybe<PsalmData>;
  rootTransposition?: Maybe<Scalars['Int']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  activePsalmChordsSubscription?: Maybe<SubscriptingPsalmData>;
  activeSlideSubscription?: Maybe<Slide>;
  favouritePsalms: Array<PsalmsBookItem>;
};

export enum TabType {
  Bible = 'Bible',
  Psalm = 'Psalm',
  Sermon = 'Sermon'
}
