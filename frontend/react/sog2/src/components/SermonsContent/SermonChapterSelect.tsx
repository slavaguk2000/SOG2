import React, { useMemo } from 'react';

import { useInstrumentsField } from '../../providers/instrumentsFieldProvider';
import { usePlayerContext } from '../../providers/playerProvider';
import { useSermonData } from '../../providers/sermanDataProvider';
import { formatTime } from '../../utils';
import BibleEntityItem from '../BibleContent/BibleEntityItem';

import { SermonChapterSelectWrapper } from './styled';

const SermonChapterSelect = () => {
  const { currentSermonSlides, handleUpdateSlide, audioMapping } = useSermonData();
  const { currentSlide } = useInstrumentsField();
  const { isPlaying } = usePlayerContext();

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

  return (
    <SermonChapterSelectWrapper>
      {preparedData?.map(({ content, id, slide, tooltip }) => (
        <BibleEntityItem
          key={id}
          name={content}
          onClick={() => handleUpdateSlide(slide)}
          selected={currentSlide?.id === id}
          tooltip={tooltip}
        />
      ))}
    </SermonChapterSelectWrapper>
  );
};

export default SermonChapterSelect;
