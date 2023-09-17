import React from 'react';

import { BibleVersesWrapper } from './styled';
import ValidBibleVerseSelect from './ValidBibleVerseSelect';

interface BibleVersesSelectProps {
  chapter?: number;
  bookId?: string;
}

const BibleVersesSelect = ({ bookId, chapter }: BibleVersesSelectProps) => {
  const validVerses = bookId && chapter;

  return (
    <BibleVersesWrapper>
      {validVerses ? <ValidBibleVerseSelect bibleId={'0'} bookId={bookId} chapter={chapter} /> : `${bookId} ${chapter}`}
    </BibleVersesWrapper>
  );
};

export default BibleVersesSelect;
