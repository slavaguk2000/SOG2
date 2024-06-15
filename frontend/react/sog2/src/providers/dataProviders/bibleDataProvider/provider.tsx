import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import { bibleBooks, bibleVerses } from 'src/utils/gql/queries';
import { BibleBook, Query, QueryBibleBooksArgs, QueryBibleVersesArgs, Slide } from 'src/utils/gql/types';

import { useInstrumentsField } from '../../instrumentsFieldProvider';
import { ChapterSelector } from '../../types';

import BibleContext from './context';

export const getEntityIdFromSlide = (slide: Slide, position: number): string =>
  slide.location ? slide.location[slide.location.length - position] : '';

export const getVerseNumberFromSlide = (slide: Slide): number => Number(getEntityIdFromSlide(slide, 1));

export const getChapterNumberFromSlide = (slide: Slide): number => Number(getEntityIdFromSlide(slide, 2));

export const getBookFromSlide = (slide: Slide, bibleBooksData: BibleBook[]): BibleBook | undefined =>
  bibleBooksData.find(({ id }) => id === getEntityIdFromSlide(slide, 3));

const BibleDataProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const bibleId = searchParams.get('bibleId') ?? '';

  useEffect(() => {
    if (!bibleId) {
      setSearchParams((prev) => ({
        ...prev,
        bibleId: 'fcd38411-5f94-4bda-9a2a-cd5624b3dac2',
      }));
    }
  });

  const [currentChapter, setCurrentChapter] = useState<ChapterSelector>({
    bookIdx: undefined,
    chapterId: undefined,
  });

  const [lastSlide, setLastSlide] = useState<Slide | undefined>(undefined);

  const { data } = useQuery<Pick<Query, 'bibleBooks'>, QueryBibleBooksArgs>(bibleBooks, {
    variables: {
      bibleId,
    },
    skip: !bibleId,
    fetchPolicy: 'cache-first',
  });

  const bibleBooksData = data?.bibleBooks;

  const getBookIdxById = useCallback(
    (bookId: string) => {
      if (!bibleBooksData) {
        return undefined;
      }

      const bookIdx = bibleBooksData.findIndex(({ id }) => id === bookId);

      if (bookIdx < 0) {
        return undefined;
      }

      return bookIdx;
    },
    [bibleBooksData],
  );

  const handleBookSelect = (selectedId: string) => {
    const bookIdx = getBookIdxById(selectedId);

    if (bookIdx !== undefined) {
      setCurrentChapter({
        bookIdx,
        chapterId: undefined,
      });

      setLastSlide(undefined);
    }
  };

  const getReadableBiblePlace = (slide: Slide, withVerse?: boolean) =>
    bibleBooksData
      ? `${getBookFromSlide(slide, bibleBooksData)?.name ?? ''} ${getChapterNumberFromSlide(slide)}${
          withVerse ? `:${getVerseNumberFromSlide(slide)}` : ''
        }`
      : '';

  const handleUpdateLocation = (newSlide: Slide) => {
    if (!newSlide.location) {
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

  const { handleUpdateSlide: instrumentsHandleUpdateSlide, currentSlide } = useInstrumentsField();

  const handleUpdateSlide = (newSlide?: Slide) => {
    if (newSlide) {
      setLastSlide(newSlide);
      handleUpdateLocation(newSlide);
    }

    instrumentsHandleUpdateSlide(
      newSlide && {
        slide: newSlide,
        presentationData: {
          text: `${getVerseNumberFromSlide(newSlide)}. ${newSlide.content}`,
          title: getReadableBiblePlace(newSlide),
        },
      },
    );
  };

  const currentBook = useMemo(
    () => (bibleBooksData && currentChapter.bookIdx !== undefined ? bibleBooksData[currentChapter.bookIdx] : undefined),
    [bibleBooksData, currentChapter.bookIdx],
  );

  const bookId = currentBook?.id ?? (bibleBooksData?.[0]?.id as string) ?? '';

  const { data: versesData, loading: versesDataLoading } = useQuery<Pick<Query, 'bibleVerses'>, QueryBibleVersesArgs>(
    bibleVerses,
    {
      variables: {
        bibleId,
        bookId,
        chapter: currentChapter?.chapterId ?? 1,
      },
      fetchPolicy: 'cache-first',
      skip: !(bibleBooksData && bookId),
    },
  );

  const validVersesData = versesData && !versesDataLoading;

  const selectedOrPreselectedSlide = currentSlide || lastSlide;

  const handleNextSlide = () => {
    if (validVersesData && selectedOrPreselectedSlide) {
      const nextVerseIdx = getVerseNumberFromSlide(selectedOrPreselectedSlide); // idx from 1

      if (nextVerseIdx < versesData?.bibleVerses?.length) {
        handleUpdateSlide(versesData.bibleVerses[nextVerseIdx]);
      }
    }
  };

  const handlePrevSlide = () => {
    if (validVersesData && selectedOrPreselectedSlide) {
      const prevVerseIdx = getVerseNumberFromSlide(selectedOrPreselectedSlide) - 2; // idx from 1

      if (prevVerseIdx >= 0) {
        handleUpdateSlide(versesData.bibleVerses[prevVerseIdx]);
      }
    }
  };

  const handleChapterSelect = (selectedId: number) => {
    setCurrentChapter((prev) => ({
      ...prev,
      chapterId: selectedId,
    }));

    setLastSlide(undefined);
  };

  const slideInChapter = useMemo<boolean>(() => {
    if (!selectedOrPreselectedSlide?.location) {
      return false;
    }

    const [slideBibleId, slideBookId, slideChapter] = selectedOrPreselectedSlide.location;

    if (bibleId !== slideBibleId) {
      return false;
    }

    const bookIdx = getBookIdxById(slideBookId);

    return bookIdx === currentChapter.bookIdx && Number(slideChapter) === currentChapter.chapterId;
  }, [bibleId, currentChapter.bookIdx, currentChapter.chapterId, getBookIdxById, selectedOrPreselectedSlide?.location]);

  return (
    <BibleContext.Provider
      value={{
        bibleId,
        currentChapter,
        currentBook,
        handleChapterSelect,
        handleUpdateLocation,
        getReadableBiblePlace,
        bibleBooksData,
        versesData,
        lastSlide,
        handleUpdateSlide,
        handleBookSelect,
        handleNextSlide,
        handlePrevSlide,
        slideInChapter,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};

export default BibleDataProvider;
