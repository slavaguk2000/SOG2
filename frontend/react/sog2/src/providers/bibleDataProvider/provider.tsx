import React, { PropsWithChildren, SetStateAction, useMemo, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';

import { bibleBooks, bibleVerses, setActiveSlide } from 'src/utils/gql/queries';
import {
  BibleBook,
  Mutation,
  MutationSetActiveSlideArgs,
  Query,
  QueryBibleBooksArgs,
  QueryBibleVersesArgs,
  Slide,
} from 'src/utils/gql/types';

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
  const [silentMode, setSilentMode] = useState<boolean>(false);
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

  const [setActiveSlideMutation] = useMutation<Pick<Mutation, 'setActiveSlide'>, MutationSetActiveSlideArgs>(
    setActiveSlide,
  );

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

  const sendActiveSlide = (newSlide?: Slide) => {
    setActiveSlideMutation({
      variables: {
        slideId: newSlide?.id,
      },
    }).catch((e) => console.error(e));
  };

  const updateSlideOnPresentation = (newSlide?: Slide) => {
    if (!newSlide) {
      setText('', '');

      return;
    }

    if (bibleId === newSlide.location[0] && bibleBooksData) {
      setText(
        `${getVerseNumberFromSlide(newSlide)}. ${newSlide.content}`,
        `${getBookFromSlide(newSlide, bibleBooksData)?.name ?? ''} ${getChapterNumberFromSlide(newSlide)}`,
      );
    }
  };

  const updatePresentationAndBackendSlide = (newSlide?: Slide) => {
    sendActiveSlide(newSlide);
    updateSlideOnPresentation(newSlide);
  };

  const handleUpdateSlide = (newSlide?: Slide) => {
    setCurrentSlide(newSlide);

    if (!silentMode) {
      updatePresentationAndBackendSlide(newSlide);
    }

    if (!newSlide) {
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
      }
    }
  };

  const currentBook = useMemo(
    () => (bibleBooksData && currentChapter.bookIdx !== undefined ? bibleBooksData[currentChapter.bookIdx] : undefined),
    [bibleBooksData, currentChapter.bookIdx],
  );

  const { data: versesData, loading: versesDataLoading } = useQuery<Pick<Query, 'bibleVerses'>, QueryBibleVersesArgs>(
    bibleVerses,
    {
      variables: {
        bibleId,
        bookId: currentBook?.id ?? (bibleBooksData?.[0].id as string),
        chapter: currentChapter?.chapterId ?? 1,
      },
      fetchPolicy: 'cache-first',
      skip: !bibleBooksData,
    },
  );

  const validVersesData = versesData && !versesDataLoading;

  const handleNextSlide = () => {
    if (validVersesData && currentSlide) {
      const nextVerseIdx = getVerseNumberFromSlide(currentSlide); // idx from 1

      if (nextVerseIdx < versesData?.bibleVerses?.length) {
        handleUpdateSlide(versesData.bibleVerses[nextVerseIdx]);
      }
    }
  };

  const handlePrevSlide = () => {
    if (validVersesData && currentSlide) {
      const prevVerseIdx = getVerseNumberFromSlide(currentSlide) - 2; // idx from 1

      if (prevVerseIdx >= 0) {
        handleUpdateSlide(versesData.bibleVerses[prevVerseIdx]);
      }
    }
  };

  const handleSetSilentMode = (setter: SetStateAction<boolean>) => {
    setSilentMode((prev) => {
      const newMode = typeof setter === 'function' ? setter(prev) : setter;

      updatePresentationAndBackendSlide(newMode ? undefined : currentSlide);

      return newMode;
    });
  };

  return (
    <BibleContext.Provider
      value={{
        bibleId,
        currentChapter,
        currentBook,
        setCurrentChapter,
        bibleBooksData,
        versesData,
        currentSlide,
        handleUpdateSlide,
        handleBookSelect,
        handleNextSlide,
        handlePrevSlide,
        silentMode,
        setSilentMode: handleSetSilentMode,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};

export default BibleDataProvider;
