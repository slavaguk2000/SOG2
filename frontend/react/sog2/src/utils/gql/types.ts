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

export type Mutation = {
  __typename?: 'Mutation';
  addBibleFromSog?: Maybe<Scalars['Boolean']['output']>;
  addPsalmsFromSog?: Maybe<Scalars['Boolean']['output']>;
  parseSermonsFromBranhamRu?: Maybe<Scalars['Boolean']['output']>;
  setActiveSlide?: Maybe<Scalars['Boolean']['output']>;
  setActiveSlideOffset?: Maybe<Scalars['Boolean']['output']>;
  setFreeSlide?: Maybe<Scalars['Boolean']['output']>;
  syncBibleToElastic?: Maybe<Scalars['Boolean']['output']>;
  syncSermonsToElastic?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationAddBibleFromSogArgs = {
  language: Scalars['String']['input'];
  sogFileSrc: Scalars['String']['input'];
  translation: Scalars['String']['input'];
};


export type MutationAddPsalmsFromSogArgs = {
  language: Scalars['String']['input'];
  sogFileSrc: Scalars['String']['input'];
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

export type Psalm = {
  __typename?: 'Psalm';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type PsalmsBook = {
  __typename?: 'PsalmsBook';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  bibleBooks: Array<BibleBook>;
  bibleHistory: Array<Slide>;
  bibleVerses: Array<Slide>;
  psalm: Array<Slide>;
  psalms: Array<Maybe<Psalm>>;
  psalmsBooks: Array<Maybe<PsalmsBook>>;
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

export type Subscription = {
  __typename?: 'Subscription';
  activeSlideSubscription?: Maybe<Slide>;
};

export enum TabType {
  Bible = 'Bible',
  Sermon = 'Sermon'
}
