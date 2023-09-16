import React, { useMemo } from 'react';

import BibleEntityItem from './BibleEntityItem';
import { BibleChapterSelectWrapper } from './styled';

interface BibleChapterSelectProps {
  chaptersCount: number;
  currentChapter?: number;
  onChapterSelect: (chapter: number) => void;
}

const BibleChapterSelect = ({ chaptersCount, onChapterSelect }: BibleChapterSelectProps) => {
  const chapters = useMemo(() => Array.from({ length: chaptersCount }).map((_, idx) => idx + 1), [chaptersCount]);

  return (
    <BibleChapterSelectWrapper>
      {chapters.map((chapter) => (
        <BibleEntityItem key={chapter} name={String(chapter)} onClick={() => onChapterSelect(chapter)} />
      ))}
    </BibleChapterSelectWrapper>
  );
};

export default BibleChapterSelect;
