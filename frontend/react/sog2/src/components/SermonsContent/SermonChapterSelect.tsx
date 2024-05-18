import React, { useEffect, useMemo, useRef } from 'react';

import PreselectBox from '../../hooks/useFastNumberSelection/PreselectBox';
import useFastNumberSelection from '../../hooks/useFastNumberSelection/useFastNumberSelection';
import { useInstrumentsField } from '../../providers/instrumentsFieldProvider';
import { usePlayerContext } from '../../providers/playerProvider';
import { useSermonData } from '../../providers/sermanDataProvider';
import { formatTime } from '../../utils';
import { Slide } from '../../utils/gql/types';
import SlideWithPreview from '../SlideWithPreview';

import { SermonChapterSelectWrapper } from './styled';

const debounceSeconds = 0.7;

const SermonChapterSelect = () => {
  const { currentSermonSlides, handleUpdateSlide, audioMapping } = useSermonData();
  const { currentSlide } = useInstrumentsField();
  const { isPlaying } = usePlayerContext();
  const chaptersRef = useRef<HTMLElement>(null);

  const preparedData = useMemo(
    () =>
      currentSermonSlides?.map((slide) => {
        const slideAudioMapping = slide.audioMappings?.find(
          ({ slideCollectionAudioMappingId }) => audioMapping?.id === slideCollectionAudioMappingId,
        );

        return {
          id: slide.id,
          content: `${slide.location?.[2] ? `${slide.location?.[2]}. ` : ''}${slide.content}`,
          slide,
          tooltip: isPlaying && slideAudioMapping?.timePoint ? formatTime(slideAudioMapping.timePoint) : undefined,
        };
      }),
    [audioMapping?.id, currentSermonSlides, isPlaying],
  );

  const { numberToSlideMap, maxSlideNumber } = useMemo(() => {
    if (!preparedData) {
      return {};
    }

    let maxNumber = 0;
    const serviceNumberToSlideMap: Record<number, { slide: Slide; idx: number }> = {};
    const resultNumberToSlideMap: Record<number, Slide> = {};

    preparedData.forEach(({ slide }, idx) => {
      if (slide.location?.[2]) {
        const slideNumber = Number(slide.location[2]);
        serviceNumberToSlideMap[slideNumber] = { slide, idx };
        maxNumber = Math.max(slideNumber, maxNumber);
      }
    });

    for (let i = 1; i <= maxNumber; i++) {
      if (!serviceNumberToSlideMap[i]) {
        const prevIdx = serviceNumberToSlideMap[i - 1]?.idx;
        if (prevIdx) {
          const currentIdx = prevIdx + 1;
          serviceNumberToSlideMap[i] = {
            slide: preparedData[currentIdx].slide,
            idx: currentIdx,
          };
        }
      }

      resultNumberToSlideMap[i] = serviceNumberToSlideMap[i].slide;
    }

    return {
      numberToSlideMap: resultNumberToSlideMap,
      maxSlideNumber: maxNumber,
    };
  }, [preparedData]);

  const changeChapterByNumber = (requestedNumber: number) => {
    const requestedSlide = numberToSlideMap?.[requestedNumber];
    if (requestedSlide) {
      handleUpdateSlide(requestedSlide);
    }
  };

  const { preselectNumber, handleKeyDown } = useFastNumberSelection(changeChapterByNumber, Number(maxSlideNumber), {
    debounceSeconds,
  });

  useEffect(() => {
    if (currentSlide) {
      chaptersRef?.current?.focus();
    }
  }, [currentSlide]);

  return (
    <SermonChapterSelectWrapper tabIndex={0} onKeyDown={handleKeyDown} ref={chaptersRef}>
      <PreselectBox preselectNumber={preselectNumber} debounceSeconds={debounceSeconds} />
      {preparedData?.map(({ content, id, slide, tooltip }) => (
        <SlideWithPreview
          key={id}
          bibleEntityItemProps={{
            name: content,
            onClick: () => handleUpdateSlide(slide),
            selected: currentSlide?.id === id,
            tooltip,
          }}
        />
      ))}
    </SermonChapterSelectWrapper>
  );
};

export default SermonChapterSelect;
