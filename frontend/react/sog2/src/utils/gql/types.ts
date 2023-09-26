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
};


export type MutationSetActiveSlideArgs = {
  slideId?: InputMaybe<Scalars['ID']['input']>;
};

export type Query = {
  __typename?: 'Query';
  bibleBooks: Array<BibleBook>;
  bibleVerses: Array<Slide>;
  search: Array<Slide>;
};


export type QueryBibleBooksArgs = {
  bibleId: Scalars['ID']['input'];
};


export type QueryBibleVersesArgs = {
  bibleId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
  chapter: Scalars['Int']['input'];
};


export type QuerySearchArgs = {
  searchPattern: Scalars['String']['input'];
};

export type Slide = {
  __typename?: 'Slide';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location: Array<Scalars['String']['output']>;
  searchContent: Scalars['String']['output'];
};

export type SlideLocation = {
  __typename?: 'SlideLocation';
  location: Array<Scalars['String']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  activeSlideSubscription?: Maybe<Slide>;
};
