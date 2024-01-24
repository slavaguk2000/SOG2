import React, { useMemo } from 'react';

import { useInstrumentsField } from '../../providers/instrumentsFieldProvider';
import { useSermonData } from '../../providers/sermanDataProvider';
import BibleEntityItem from '../BibleContent/BibleEntityItem';

import { SermonChapterSelectWrapper } from './styled';

const SermonChapterSelect = () => {
  const { currentSermonSlides, handleUpdateSlide } = useSermonData();
  const { currentSlide } = useInstrumentsField();

  const preparedData = useMemo(
    () =>
      currentSermonSlides?.map((slide) => {
        return {
          id: slide.id,
          content: `${slide.location?.[2] ? `${slide.location?.[2]}. ` : ''}${slide.content}`,
          slide,
        };
      }),
    [currentSermonSlides],
  );

  return (
    <SermonChapterSelectWrapper>
      {preparedData?.map(({ content, id, slide }) => (
        <BibleEntityItem
          key={id}
          name={content}
          onClick={() => handleUpdateSlide(slide)}
          selected={currentSlide?.id === id}
        />
      ))}
    </SermonChapterSelectWrapper>
  );
};

export default SermonChapterSelect;
