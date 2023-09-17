import React from 'react';

import { useBibleData } from '../../providers/bibleDataProvider';

import BibleBookSelect from './BibleBookSelect';
import BibleChapterSelect from './BibleChapterSelect';
import BibleVersesSelect from './BibleVerseSelect';
import { BibleContentWrapper } from './styled';

const BibleContent = () => {
  const { currentChapter, setCurrentChapter, bibleBooksData, handleBookSelect } = useBibleData();

  const currentBook =
    bibleBooksData && currentChapter.bookIdx !== undefined ? bibleBooksData[currentChapter.bookIdx] : undefined;

  const chaptersCount = currentBook?.chapterCount ?? 0;

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
