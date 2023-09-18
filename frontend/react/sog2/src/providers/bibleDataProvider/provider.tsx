import React, { PropsWithChildren, useState } from 'react';

import { useQuery } from '@apollo/client';

import { bibleBooks } from '../../utils/gql/queries';
import { BibleBook, Query, QueryBibleBooksArgs, Slide } from '../../utils/gql/types';
import { usePresentation } from '../presentationProvider';
import { ChapterSelector } from '../types';

import BibleContext from './context';

interface BibleDataProviderProps {
  bibleId: string;
}

export const getEntityIdFromSlide = (slide: Slide, position: number): string =>
  slide.location[slide.location.length - position];

export const getVerseNumberFromSlide = (slide: Slide): number => Number(getEntityIdFromSlide(slide, 1));

export const getChapterNumberFromSlide = (slide: Slide): number => Number(getEntityIdFromSlide(slide, 2));

export const getBookFromSlide = (slide: Slide, bibleBooksData: BibleBook[]): BibleBook | undefined =>
  bibleBooksData.find(({ id }) => id === getEntityIdFromSlide(slide, 3));

const BibleDataProvider = ({ bibleId = '0', children }: PropsWithChildren<BibleDataProviderProps>) => {
  const [currentChapter, setCurrentChapter] = useState<ChapterSelector>({
    bookIdx: undefined,
    chapterId: undefined,
  });

  const [currentSlide, setCurrentSlide] = useState<Slide | undefined>(undefined);

  const { data } = useQuery<Pick<Query, 'bibleBooks'>, QueryBibleBooksArgs>(bibleBooks, {
    variables: {
      bibleId,
    },
    fetchPolicy: 'cache-first',
  });

  const bibleBooksData = data?.bibleBooks;

  const getBookIdxById = (bookId: string) => {
    if (!bibleBooksData) {
      return undefined;
    }

    const bookIdx = bibleBooksData.findIndex(({ id }) => id === bookId);

    if (bookIdx < 0) {
      return undefined;
    }

    return bookIdx;
  };

  const handleBookSelect = (selectedId: string) => {
    const bookIdx = getBookIdxById(selectedId);

    if (bookIdx !== undefined) {
      setCurrentChapter({
        bookIdx,
        chapterId: undefined,
      });
    }
  };

  const { setText } = usePresentation();

  const handleUpdateSlide = (newSlide?: Slide) => {
    setCurrentSlide(newSlide);

    if (!newSlide) {
      setText('', '');

      return;
    }

    const [slideBibleId, slideBookId, slideChapter] = newSlide.location;

    if (bibleId === slideBibleId) {
      const bookIdx = getBookIdxById(slideBookId);

      if (bookIdx !== undefined) {
        setCurrentChapter({
          bookIdx,
          chapterId: Number(slideChapter),
        });

        if (bibleBooksData) {
          setText(
            `${getVerseNumberFromSlide(newSlide)}. ${newSlide.content}`,
            `${getBookFromSlide(newSlide, bibleBooksData)?.name ?? ''} ${getChapterNumberFromSlide(newSlide)}`,
          );
        }
      }
    }
  };

  return (
    <BibleContext.Provider
      value={{
        bibleId,
        currentChapter,
        setCurrentChapter,
        bibleBooksData,
        currentSlide,
        handleUpdateSlide,
        handleBookSelect,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};

export default BibleDataProvider;
