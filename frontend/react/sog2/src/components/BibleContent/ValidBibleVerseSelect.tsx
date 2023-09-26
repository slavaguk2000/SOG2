import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Box } from '@mui/material';

import { useBibleData } from 'src/providers/bibleDataProvider';
import { Slide } from 'src/utils/gql/types';

import BibleEntityItem from './BibleEntityItem';
import { VersePreselectBox } from './styled';

const verseModifier = (slide: Slide) => {
  const { content, location } = slide;

  return {
    text: `${location[location.length - 1]}. ${content}`,
    location,
    slide,
  };
};

const debounceSeconds = 0.7;

const ValidBibleVerseSelect = () => {
  const { currentSlide, handleUpdateSlide, versesData, handlePrevSlide, handleNextSlide } = useBibleData();
  const [preselectNumberVerse, setPreselectNumber] = useState<number>(0);

  const verses = useMemo(() => versesData?.bibleVerses.map(verseModifier), [versesData]);

  const changeVerseByNumber = useCallback(
    (verseNumber: number) => {
      const newSlide = verses?.[verseNumber - 1]?.slide;

      if (newSlide) {
        handleUpdateSlide(newSlide);
      }
    },
    [handleUpdateSlide, verses],
  );

  useEffect(() => {
    const selectPreselectNumberVerseCallback = setTimeout(() => {
      if (preselectNumberVerse) {
        changeVerseByNumber(preselectNumberVerse);

        setPreselectNumber(0);
      }
    }, 1000 * debounceSeconds);

    return () => clearTimeout(selectPreselectNumberVerseCallback);
  }, [changeVerseByNumber, preselectNumberVerse]);

  const handleNumberPressed = (pressedNumber: number): boolean => {
    if (!verses || pressedNumber > verses.length) {
      return false;
    }

    setPreselectNumber((prev) => {
      const maybeNewPreselect = prev * 10 + pressedNumber;

      if (maybeNewPreselect * 10 > verses.length) {
        changeVerseByNumber(maybeNewPreselect > verses.length ? prev : maybeNewPreselect);

        return 0;
      }

      return maybeNewPreselect;
    });

    return true;
  };

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
      default:
        if (event.key.length === 1 && /[0-9]/.test(event.key)) {
          if (handleNumberPressed(Number(event.key))) {
            event.stopPropagation();
          }
        }
    }
  };

  return (
    <Box tabIndex={0} onKeyDown={handleKeyDown}>
      {preselectNumberVerse ? (
        <VersePreselectBox debounceSeconds={debounceSeconds} key={preselectNumberVerse}>
          {preselectNumberVerse}
        </VersePreselectBox>
      ) : undefined}
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
