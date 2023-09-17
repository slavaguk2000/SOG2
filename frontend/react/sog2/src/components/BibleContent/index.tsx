import React, { useState } from 'react';

import { useQuery } from '@apollo/client';

import { bibleBooks } from 'src/utils/gql/queries';
import { Query, QueryBibleBooksArgs } from 'src/utils/gql/types';

import BibleBookSelect from './BibleBookSelect';
import BibleChapterSelect from './BibleChapterSelect';
import BibleVersesSelect from './BibleVerseSelect';
import { BibleContentWrapper } from './styled';

export interface ChapterSelector {
  bookIdx?: number;
  chapterId?: number;
}

const BibleContent = () => {
  const [currentChapter, setCurrentChapter] = useState<ChapterSelector>({
    bookIdx: undefined,
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
    bibleBooksData && currentChapter.bookIdx !== undefined ? bibleBooksData[currentChapter.bookIdx] : undefined;

  const chaptersCount = currentBook?.chapterCount ?? 0;

  const handleBookSelect = (selectedId: string) => {
    if (!bibleBooksData) {
      return;
    }

    const bookIdx = bibleBooksData.findIndex(({ id }) => id === selectedId);

    if (bookIdx < 0) {
      return;
    }

    setCurrentChapter({
      bookIdx,
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
      <BibleBookSelect books={bibleBooksData} currentBookIdx={currentChapter.bookIdx} onBookSelect={handleBookSelect} />
      <BibleChapterSelect
        chaptersCount={chaptersCount}
        onChapterSelect={handleChapterSelect}
        currentChapter={currentChapter.chapterId}
      />
      <BibleVersesSelect chapter={currentChapter.chapterId} bookId={currentBook?.id} />
    </BibleContentWrapper>
  );
};

export default BibleContent;
