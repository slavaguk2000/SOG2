import React, { useMemo } from 'react';

import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';

import { bibleVerses } from 'src/utils/gql/queries';
import { Query, QueryBibleVersesArgs, Slide } from 'src/utils/gql/types';

import BibleEntityItem from './BibleEntityItem';

interface ValidBibleVerseSelect {
  bibleId: string;
  bookId: string;
  chapter: number;
}

const verseModifier = ({ content, location }: Slide) => ({
  text: `${location[location.length - 1]}. ${content}`,
  location,
});

const ValidBibleVerseSelect = ({ bibleId, bookId, chapter }: ValidBibleVerseSelect) => {
  const { data } = useQuery<Pick<Query, 'bibleVerses'>, QueryBibleVersesArgs>(bibleVerses, {
    variables: {
      bibleId,
      bookId,
      chapter,
    },
    fetchPolicy: 'cache-first',
  });

  const verses = useMemo(() => data?.bibleVerses.map(verseModifier), [data]);

  return (
    <Box>
      {verses?.map(({ text, location }) => (
        <BibleEntityItem key={location[location.length - 1]} name={text} onClick={() => true} />
      ))}
    </Box>
  );
};

export default ValidBibleVerseSelect;
