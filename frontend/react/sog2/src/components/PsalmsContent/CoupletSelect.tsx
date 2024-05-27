import React, { useEffect, useMemo, useRef } from 'react';

import PreselectBox from '../../hooks/useFastNumberSelection/PreselectBox';
import useFastNumberSelection from '../../hooks/useFastNumberSelection/useFastNumberSelection';
import { getPsalmSlideContentFromSlide, usePsalmsData } from '../../providers/dataProviders/psalmsDataProvider';
import { useInstrumentsField } from '../../providers/instrumentsFieldProvider';
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

  const changeCoupletByNumber = (requestedNumber: number) => {
    // const requestedSlide = numberToSlideMap?.[requestedNumber];
    // if (requestedSlide) {
    //   handleUpdateSlide(requestedSlide);
    // }
  };

  const { preselectNumber, handleKeyDown } = useFastNumberSelection(
    changeCoupletByNumber,
    Number(psalmSlides?.length ?? 0),
    {
      debounceSeconds,
    },
  );

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
