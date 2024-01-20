import React, { useMemo } from 'react';

import { useSermonData } from '../../providers/sermanDataProvider';
import BibleEntityItem from '../BibleContent/BibleEntityItem';

import { SermonChapterSelectWrapper } from './styled';

const SermonChapterSelect = () => {
  const { currentSermonSlides } = useSermonData();

  console.log(currentSermonSlides);

  const preparedData = useMemo(
    () =>
      currentSermonSlides?.map(({ id, content, location }) => {
        return { id, content: `${location?.[2] ? `${location?.[2]}. ` : ''}${content}` };
      }),
    [currentSermonSlides],
  );

  return (
    <SermonChapterSelectWrapper>
      {preparedData?.map(({ content, id }) => (
        <BibleEntityItem key={id} name={content} onClick={() => true} selected={false} />
      ))}
    </SermonChapterSelectWrapper>
  );
};

export default SermonChapterSelect;
