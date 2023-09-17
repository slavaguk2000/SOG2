import React, { useMemo } from 'react';

import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';

import { bibleVerses } from 'src/utils/gql/queries';
import { Query, QueryBibleVersesArgs, Slide } from 'src/utils/gql/types';

import { useBibleData } from '../../providers/bibleDataProvider';

import BibleEntityItem from './BibleEntityItem';

interface ValidBibleVerseSelectProps {
  bibleId: string;
  bookId: string;
  chapter: number;
}

const verseModifier = (slide: Slide) => {
  const { content, location } = slide;

  return {
    text: `${location[location.length - 1]}. ${content}`,
    location,
    slide,
  };
};

const ValidBibleVerseSelect = ({ bibleId, bookId, chapter }: ValidBibleVerseSelectProps) => {
  const { data } = useQuery<Pick<Query, 'bibleVerses'>, QueryBibleVersesArgs>(bibleVerses, {
    variables: {
      bibleId,
      bookId,
      chapter,
    },
    fetchPolicy: 'cache-first',
  });

  const verses = useMemo(() => data?.bibleVerses.map(verseModifier), [data]);

  const { currentSlide, handleUpdateSlide } = useBibleData();

  return (
    <Box>
      {verses?.map(({ text, location, slide }) => (
        <BibleEntityItem
          key={location[location.length - 1]}
          name={text}
          onClick={() => handleUpdateSlide(slide)}
          selected={Boolean(
            currentSlide && currentSlide.location[currentSlide.location.length - 1] === location[location.length - 1],
          )}
        />
      ))}
    </Box>
  );
};

export default ValidBibleVerseSelect;
