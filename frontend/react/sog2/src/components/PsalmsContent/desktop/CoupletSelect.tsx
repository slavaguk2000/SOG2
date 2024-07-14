import React, { useEffect, useMemo, useRef } from 'react';

import PreselectBox from '../../../hooks/useFastNumberSelection/PreselectBox';
import useFastNumberSelection from '../../../hooks/useFastNumberSelection/useFastNumberSelection';
import {
  getPsalmSlideContentFromSlide,
  useCurrentPsalms,
} from '../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import { useInstrumentsField } from '../../../providers/instrumentsFieldProvider';
import { Slide } from '../../../utils/gql/types';
import BibleEntityItem from '../../BibleContent/BibleEntityItem';

import { CoupletSelectWrapper } from './styled';

const debounceSeconds = 0.7;

const CoupletSelect = () => {
  const coupletsRef = useRef<HTMLElement>(null);

  const { psalmData, handleUpdateSlide } = useCurrentPsalms();
  const { currentSlide } = useInstrumentsField();

  const preparedData = useMemo(
    () =>
      psalmData?.couplets.map(({ slide }) => ({
        id: slide.id,
        content: getPsalmSlideContentFromSlide(slide),
        slide,
      })),
    [psalmData],
  );

  const { numberToSlideMap, maxNumber } = useMemo(
    () =>
      (psalmData?.couplets ?? []).reduce(
        (acc, { slide }) => {
          if (slide?.contentPrefix) {
            const coupletPrefix = slide.contentPrefix;

            const numberString = /^\d+/.exec(coupletPrefix.trim())?.[0];

            if (numberString) {
              const number = parseInt(numberString);
              acc.numberToSlideMap[number] = slide;
              acc.maxNumber = Math.max(acc.maxNumber, number);
            }
          }

          return acc;
        },
        {
          numberToSlideMap: {} as Record<number, Slide>,
          maxNumber: 0,
        },
      ),
    [psalmData],
  );

  const onUpdateSlide = (slide?: Slide) => {
    handleUpdateSlide(
      slide && {
        id: slide.id,
        content: slide.content,
        contentPrefix: slide.contentPrefix,
        title: slide.title,
      },
    );
  };

  const changeCoupletByNumber = (requestedNumber: number) => {
    const requestedSlide = numberToSlideMap?.[requestedNumber];
    if (requestedSlide) {
      onUpdateSlide(requestedSlide);
    }
  };

  const { preselectNumber, handleKeyDown } = useFastNumberSelection(changeCoupletByNumber, maxNumber, {
    debounceSeconds,
  });

  useEffect(() => {
    if (currentSlide) {
      coupletsRef?.current?.focus();
    }
  }, [currentSlide]);

  return (
    <CoupletSelectWrapper tabIndex={0} onKeyDown={handleKeyDown} ref={coupletsRef}>
      <PreselectBox preselectNumber={preselectNumber} debounceSeconds={debounceSeconds} />
      {preparedData?.map(({ id, content, slide }) => (
        <BibleEntityItem
          key={id}
          name={content}
          onClick={() => onUpdateSlide(slide)}
          selected={id === currentSlide?.id}
          scrollingOrder={0}
        />
      ))}
    </CoupletSelectWrapper>
  );
};

export default CoupletSelect;
