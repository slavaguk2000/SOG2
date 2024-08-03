import React, { useEffect, useMemo, useRef } from 'react';

import { Maybe } from 'graphql/jsutils/Maybe';

import PreselectBox from '../../../hooks/useFastNumberSelection/PreselectBox';
import useFastNumberSelection from '../../../hooks/useFastNumberSelection/useFastNumberSelection';
import {
  getPsalmSlideContentFromSlide,
  useCurrentPsalms,
} from '../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import { useInstrumentsField } from '../../../providers/instrumentsFieldProvider';
import { PsalmDataWithSlides, Slide } from '../../../utils/gql/types';
import BibleEntityItem from '../../BibleContent/BibleEntityItem';

import { CoupletSelectWrapper } from './styled';

const debounceSeconds = 0.7;

const getNecessaryNonNumericSlide = (
  nonNumericCouplets: Record<number, Slide>,
  psalmData: PsalmDataWithSlides,
  currentSlideId?: Maybe<string>,
) => {
  const nonNumericCoupletsOrders = Object.keys(nonNumericCouplets).map(Number);

  if (nonNumericCoupletsOrders.length === 1) {
    return nonNumericCouplets[nonNumericCoupletsOrders[0]];
  } else {
    const currentCoupletOrder = psalmData.couplets.find(({ slide }) => slide?.id === currentSlideId)?.couplet
      .initialOrder;

    if (currentCoupletOrder !== undefined) {
      const currentNonNumericIndex = nonNumericCoupletsOrders.indexOf(currentCoupletOrder);

      if (currentNonNumericIndex === -1) {
        const nextCoupletOrder = currentCoupletOrder + 1;
        if (nonNumericCoupletsOrders.includes(nextCoupletOrder)) {
          return nonNumericCouplets[nextCoupletOrder];
        } else {
          const previousOrders = nonNumericCoupletsOrders.filter((i) => i < currentCoupletOrder);

          if (previousOrders.length) {
            return nonNumericCouplets[previousOrders[previousOrders.length - 1]];
          } else {
            return nonNumericCouplets[nonNumericCoupletsOrders[0]];
          }
        }
      } else {
        const nextOrderIndex =
          currentNonNumericIndex + 1 < nonNumericCoupletsOrders.length ? currentNonNumericIndex + 1 : 0;
        return nonNumericCouplets[nonNumericCoupletsOrders[nextOrderIndex]];
      }
    } else {
      return nonNumericCouplets[nonNumericCoupletsOrders[0]];
    }
  }
};

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

  const { numberToSlideMap, maxNumber, nonNumericCouplets } = useMemo(
    () =>
      (psalmData?.couplets ?? []).reduce(
        (acc, { slide, couplet }) => {
          if (slide?.contentPrefix) {
            const coupletPrefix = slide.contentPrefix;

            const numberString = /^\d+/.exec(coupletPrefix.trim())?.[0];

            if (numberString) {
              const number = parseInt(numberString);
              acc.numberToSlideMap[number] = slide;
              acc.maxNumber = Math.max(acc.maxNumber, number);
            } else {
              acc.nonNumericCouplets[couplet.initialOrder ?? 0] = slide;
            }
          }

          return acc;
        },
        {
          numberToSlideMap: {} as Record<number, Slide>,
          maxNumber: 0,
          nonNumericCouplets: {} as Record<number, Slide>,
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

  const { preselectNumber, handleKeyDown: fastNumberSelectionKeyDown } = useFastNumberSelection(
    changeCoupletByNumber,
    maxNumber,
    {
      debounceSeconds,
    },
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!psalmData) {
      return;
    }

    if (e.key === '*' && nonNumericCouplets) {
      const necessaryNonNumericSlide = getNecessaryNonNumericSlide(nonNumericCouplets, psalmData, currentSlide?.id);

      if (necessaryNonNumericSlide) {
        onUpdateSlide(necessaryNonNumericSlide);
      }
    } else {
      fastNumberSelectionKeyDown(e);
    }
  };

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
