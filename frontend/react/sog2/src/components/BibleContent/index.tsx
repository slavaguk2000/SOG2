import React from 'react';

import { useBibleData } from '../../providers/dataProviders/bibleDataProvider';

import BibleBookSelect from './BibleBookSelect';
import BibleChapterSelect from './BibleChapterSelect';
import BibleVersesSelect from './BibleVerseSelect';
import { BibleContentWrapper } from './styled';

const BibleContent = () => {
  const { currentChapter, currentBook, handleChapterSelect, bibleBooksData, handleBookSelect } = useBibleData();

  const chaptersCount = currentBook?.chapterCount ?? bibleBooksData?.[0]?.chapterCount ?? 0;

  return (
    <BibleContentWrapper>
      <BibleBookSelect books={bibleBooksData} currentBookIdx={currentChapter.bookIdx} onBookSelect={handleBookSelect} />
      <BibleChapterSelect
        chaptersCount={chaptersCount}
        onChapterSelect={handleChapterSelect}
        currentChapter={currentChapter.chapterId}
      />
      <BibleVersesSelect chapter={currentChapter.chapterId} bookId={currentBook?.id ?? bibleBooksData?.[0]?.id} />
    </BibleContentWrapper>
  );
};

export default BibleContent;
