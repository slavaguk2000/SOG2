import React, { useMemo } from 'react';

import { Box } from '@mui/material';

import { useBibleData } from 'src/providers/bibleDataProvider';
import { Slide } from 'src/utils/gql/types';

import BibleEntityItem from './BibleEntityItem';

const verseModifier = (slide: Slide) => {
  const { content, location } = slide;

  return {
    text: `${location[location.length - 1]}. ${content}`,
    location,
    slide,
  };
};

const ValidBibleVerseSelect = () => {
  const { currentSlide, handleUpdateSlide, versesData, handlePrevSlide, handleNextSlide } = useBibleData();

  const verses = useMemo(() => versesData?.bibleVerses.map(verseModifier), [versesData]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        handlePrevSlide();
        event.preventDefault();
        event.stopPropagation();
        break;
      case 'ArrowDown':
        handleNextSlide();
        event.preventDefault();
        event.stopPropagation();
        break;
    }
  };

  return (
    <Box tabIndex={0} onKeyDown={handleKeyDown}>
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
