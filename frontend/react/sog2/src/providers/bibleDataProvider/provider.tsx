import React, { PropsWithChildren, useState } from 'react';

import { useQuery } from '@apollo/client';

import { bibleBooks } from '../../utils/gql/queries';
import { Query, QueryBibleBooksArgs, Slide } from '../../utils/gql/types';
import { ChapterSelector } from '../types';

import BibleContext from './context';

interface BibleDataProviderProps {
  bibleId: string;
}

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

  const handleUpdateSlide = (newSlide: Slide) => {
    const [slideBibleId, slideBookId, slideChapter] = newSlide.location;

    if (bibleId == slideBibleId) {
      const bookIdx = getBookIdxById(slideBookId);

      if (bookIdx !== undefined) {
        setCurrentChapter({
          bookIdx,
          chapterId: Number(slideChapter),
        });

        setCurrentSlide(newSlide);
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
