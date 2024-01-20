import React from 'react';

import { useSermonData } from '../../providers/sermanDataProvider';
import BibleEntityItem from '../BibleContent/BibleEntityItem';

import { SermonChapterSelectWrapper, SermonsContentWrapper, SermonSelectWrapper } from './styled';

const SermonsContent = () => {
  const { currentSermonSlides, sermonsData, handleSermonSelect, currentSermonId } = useSermonData();

  return (
    <SermonsContentWrapper>
      <SermonSelectWrapper>
        {sermonsData?.map(({ name, id }) => (
          <BibleEntityItem
            key={id}
            name={name}
            onClick={() => handleSermonSelect(id)}
            selected={id === currentSermonId}
          />
        ))}
      </SermonSelectWrapper>
      <SermonChapterSelectWrapper>
        {currentSermonSlides?.map(({ content, id }) => (
          <BibleEntityItem key={id} name={content} onClick={() => true} selected={false} />
        ))}
      </SermonChapterSelectWrapper>
    </SermonsContentWrapper>
  );
};

export default SermonsContent;
