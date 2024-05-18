import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { Box } from '@mui/material';

import { useBibleData } from 'src/providers/bibleDataProvider';
import { getVerseNumberFromSlide } from 'src/providers/bibleDataProvider/provider';
import { Slide } from 'src/utils/gql/types';

import PreselectBox from '../../hooks/useFastNumberSelection/PreselectBox';
import useFastNumberSelection from '../../hooks/useFastNumberSelection/useFastNumberSelection';
import { useInstrumentsField } from '../../providers/instrumentsFieldProvider';

import BibleEntityItem from './BibleEntityItem';

const verseModifier = (slide: Slide) => {
  const { content, location } = slide;

  return {
    text: `${location ? `${location[location.length - 1]}. ` : ''}${content}`,
    location,
    slide,
  };
};

const debounceSeconds = 0.7;

const ValidBibleVerseSelect = () => {
  const { currentSlide } = useInstrumentsField();
  const { handleUpdateSlide, versesData, lastSlide, slideInChapter } = useBibleData();
  const versesRef = useRef<HTMLElement>(null);

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

  const { preselectNumber, handleKeyDown } = useFastNumberSelection(changeVerseByNumber, Number(verses?.length), {
    debounceSeconds,
  });

  const selectedVerseNumber = currentSlide && getVerseNumberFromSlide(currentSlide);

  useEffect(() => {
    if (selectedVerseNumber) {
      versesRef?.current?.focus();
    }
  }, [selectedVerseNumber]);

  return (
    <Box tabIndex={0} onKeyDown={handleKeyDown} ref={versesRef}>
      <PreselectBox preselectNumber={preselectNumber} debounceSeconds={debounceSeconds} />
      {verses?.map(({ text, location, slide }, idx) => (
        <BibleEntityItem
          key={location ? location[location.length - 1] : idx}
          name={text}
          onClick={() => handleUpdateSlide(slide)}
          selected={Boolean(
            slideInChapter && selectedVerseNumber && slide && selectedVerseNumber === getVerseNumberFromSlide(slide),
          )}
          preSelected={Boolean(
            slideInChapter &&
              lastSlide &&
              slide &&
              getVerseNumberFromSlide(lastSlide) === getVerseNumberFromSlide(slide),
          )}
        />
      ))}
    </Box>
  );
};

export default ValidBibleVerseSelect;
