import React from 'react';

import { BibleVersesWrapper } from './styled';
import ValidBibleVerseSelect from './ValidBibleVerseSelect';

interface BibleVersesSelectProps {
  chapter?: number;
  bookId?: string;
}

const BibleVersesSelect = ({ bookId, chapter }: BibleVersesSelectProps) => {
  return <BibleVersesWrapper>{bookId ? <ValidBibleVerseSelect /> : `${bookId} ${chapter}`}</BibleVersesWrapper>;
};

export default BibleVersesSelect;
