import React, { useEffect, useMemo, useRef } from 'react';

import PreselectBox from '../../hooks/useFastNumberSelection/PreselectBox';
import useFastNumberSelection from '../../hooks/useFastNumberSelection/useFastNumberSelection';
import {
  extractCoupletPrefixFromLocation,
  getPsalmSlideContentFromSlide,
  usePsalmsData,
} from '../../providers/dataProviders/psalmsDataProvider';
import { useInstrumentsField } from '../../providers/instrumentsFieldProvider';
import { Slide } from '../../utils/gql/types';
import BibleEntityItem from '../BibleContent/BibleEntityItem';

import { CoupletSelectWrapper } from './styled';

const debounceSeconds = 0.7;

const CoupletSelect = () => {
  const coupletsRef = useRef<HTMLElement>(null);

  const { psalmSlides, handleUpdateSlide } = usePsalmsData();
  const { currentSlide } = useInstrumentsField();

  console.log(psalmSlides);

  const preparedData = useMemo(
    () =>
      psalmSlides?.map((slide) => ({
        id: slide.id,
        content: getPsalmSlideContentFromSlide(slide),
        slide,
      })),
    [psalmSlides],
  );

  const { numberToSlideMap, maxNumber } = useMemo(
    () =>
      (psalmSlides ?? []).reduce(
        (acc, slide) => {
          if (slide?.location) {
            const coupletPrefix = extractCoupletPrefixFromLocation(slide?.location);

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
    [psalmSlides],
  );

  const changeCoupletByNumber = (requestedNumber: number) => {
    const requestedSlide = numberToSlideMap?.[requestedNumber];
    if (requestedSlide) {
      handleUpdateSlide(requestedSlide);
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
          onClick={() => handleUpdateSlide(slide)}
          selected={id === currentSlide?.id}
        />
      ))}
    </CoupletSelectWrapper>
  );
};

export default CoupletSelect;
