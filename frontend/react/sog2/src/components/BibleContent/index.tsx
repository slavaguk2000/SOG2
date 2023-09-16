import React, { useState } from 'react';

import { useQuery } from '@apollo/client';

import { bibleBooks } from 'src/utils/gql/queries';
import { Query, QueryBibleBooksArgs } from 'src/utils/gql/types';

import BibleBookSelect from './BibleBookSelect';
import BibleChapterSelect from './BibleChapterSelect';
import BibleVersesSelect from './BibleVerseSelect';
import { BibleContentWrapper } from './styled';

export interface ChapterSelector {
  bookId?: number;
  chapterId?: number;
}

const BibleContent = () => {
  const [currentChapter, setCurrentChapter] = useState<ChapterSelector>({
    bookId: undefined,
    chapterId: undefined,
  });

  const { data } = useQuery<Pick<Query, 'bibleBooks'>, QueryBibleBooksArgs>(bibleBooks, {
    variables: {
      bibleId: '0',
    },
    fetchPolicy: 'cache-first',
  });

  const bibleBooksData = data?.bibleBooks;
  const currentBook =
    bibleBooksData && currentChapter.bookId !== undefined ? bibleBooksData[currentChapter.bookId] : undefined;

  const chaptersCount = currentBook?.chapterCount ?? 0;

  const handleBookSelect = (selectedId: string) => {
    if (!bibleBooksData) {
      return;
    }

    const bookId = bibleBooksData.findIndex(({ id }) => id === selectedId);

    if (bookId < 0) {
      return;
    }

    setCurrentChapter({
      bookId,
      chapterId: undefined,
    });
  };

  const handleChapterSelect = (selectedId: number) => {
    setCurrentChapter((prev) => ({
      ...prev,
      chapterId: selectedId,
    }));
  };

  return (
    <BibleContentWrapper>
      <BibleBookSelect books={bibleBooksData} currentBook={currentChapter.bookId} onBookSelect={handleBookSelect} />
      <BibleChapterSelect chaptersCount={chaptersCount} onChapterSelect={handleChapterSelect} />
      <BibleVersesSelect chapter={currentChapter.chapterId} bookId={currentBook?.id} />
    </BibleContentWrapper>
  );
};

export default BibleContent;
