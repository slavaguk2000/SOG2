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

export type BibleBook = {
  __typename?: 'BibleBook';
  chapterCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  setActiveSlide?: Maybe<Scalars['Boolean']['output']>;
  setFreeSlide?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationSetActiveSlideArgs = {
  slideId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationSetFreeSlideArgs = {
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  bibleBooks: Array<BibleBook>;
  bibleHistory: Array<Slide>;
  bibleVerses: Array<Slide>;
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


export type QuerySearchArgs = {
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
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  translation: Scalars['String']['output'];
};

export type Slide = {
  __typename?: 'Slide';
  content: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  location?: Maybe<Array<Scalars['String']['output']>>;
  searchContent?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type SlideLocation = {
  __typename?: 'SlideLocation';
  location: Array<Scalars['String']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  activeSlideSubscription?: Maybe<Slide>;
};

export enum TabType {
  Bible = 'Bible',
  Sermon = 'Sermon'
}
