import React from 'react';

import { BibleVersesWrapper } from './styled';
import ValidBibleVerseSelect from './ValidBibleVerseSelect';

interface BibleVersesSelectProps {
  chapter?: number;
  bookId?: string;
}

const BibleVersesSelect = ({ bookId, chapter }: BibleVersesSelectProps) => {
  return (
    <BibleVersesWrapper>
      {bookId ? <ValidBibleVerseSelect bibleId={'0'} bookId={bookId} chapter={chapter ?? 1} /> : `${bookId} ${chapter}`}
    </BibleVersesWrapper>
  );
};

export default BibleVersesSelect;
