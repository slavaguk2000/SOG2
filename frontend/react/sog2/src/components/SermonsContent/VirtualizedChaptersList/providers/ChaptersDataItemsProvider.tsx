import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef } from 'react';

import { Box } from '@mui/material';

import PreselectBox from '../../../../hooks/useFastNumberSelection/PreselectBox';
import useFastNumberSelection from '../../../../hooks/useFastNumberSelection/useFastNumberSelection';
import { useAudioMapping } from '../../../../providers/AudioMapping/provider';
import { useSermonData } from '../../../../providers/dataProviders/sermanDataProvider';
import { useChapters } from '../../../../providers/dataProviders/sermanDataProvider/ChaptersProvider';
import { useInstrumentsField } from '../../../../providers/instrumentsFieldProvider';
import { usePlayerContext } from '../../../../providers/playerProvider';
import { formatTime } from '../../../../utils';
import { Slide } from '../../../../utils/gql/types';
import SlideWithPreview from '../../../SlideWithPreview';
import ItemsDataProvider from '../../../VirtualizedScroll/Providers/ItemsDataProvider';

const debounceSeconds = 0.7;

const ChaptersDataItemsProvider = ({ children }: PropsWithChildren) => {
  const { handleUpdateSlide, audioMapping } = useSermonData();
  const { chapters } = useChapters();
  const { currentSlide } = useInstrumentsField();
  const { openInterface, seek } = usePlayerContext();
  const { follow } = useAudioMapping();
  const chaptersRef = useRef<HTMLElement>(null);

  const preparedData = useMemo(
    () =>
      chapters?.map((slide) => {
        const slideAudioMapping = slide.audioMappings?.find(
          ({ slideCollectionAudioMappingId }) => audioMapping?.id === slideCollectionAudioMappingId,
        );

        return {
          id: slide.id,
          content: `${slide.location?.[2] ? `${slide.location?.[2]}. ` : ''}${slide.content}`,
          slide,
          tooltip: openInterface && slideAudioMapping?.timePoint ? formatTime(slideAudioMapping.timePoint) : undefined,
          timePoint: slideAudioMapping?.timePoint,
        };
      }),
    [audioMapping?.id, chapters, openInterface],
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

  const onUpdateSlide = useCallback(
    (newSlide?: Slide, timePoint?: number) => {
      handleUpdateSlide(newSlide);

      if (follow && timePoint !== undefined) {
        seek(timePoint);
      }
    },
    [follow, handleUpdateSlide, seek],
  );

  const changeChapterByNumber = (requestedNumber: number) => {
    const requestedSlide = numberToSlideMap?.[requestedNumber];
    if (requestedSlide) {
      onUpdateSlide(requestedSlide);
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

  const selected = useMemo(
    () => currentSlide && preparedData?.findIndex(({ id }) => id === currentSlide.id),
    [currentSlide, preparedData],
  );

  const getItem = useCallback(
    (index: number) => {
      const currentChapter = preparedData?.[index];

      return currentChapter ? (
        <Box width="100%">
          <SlideWithPreview
            bibleEntityItemProps={{
              name: currentChapter.content,
              onClick: () => onUpdateSlide(currentChapter.slide, currentChapter.timePoint ?? undefined),
              selected: currentSlide?.id === currentChapter.id,
              tooltip: currentChapter.tooltip,
              scrollingOrder: 0,
            }}
          />
        </Box>
      ) : null;
    },
    [currentSlide?.id, onUpdateSlide, preparedData],
  );

  return (
    <ItemsDataProvider getItem={getItem} selected={selected}>
      <Box onKeyDown={handleKeyDown}>
        <PreselectBox preselectNumber={preselectNumber} debounceSeconds={debounceSeconds} />
        {children}
      </Box>
    </ItemsDataProvider>
  );
};

export default ChaptersDataItemsProvider;
