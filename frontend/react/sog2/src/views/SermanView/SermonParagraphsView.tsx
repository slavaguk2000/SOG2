import React, { FC } from 'react';

import { Box } from '@mui/material';

import BibleEntityItem from '../../components/BibleContent/BibleEntityItem';
import { useSermonData } from '../../providers/sermanDataProvider';

const SermonParagraphsView: FC = () => {
  const { currentSermonSlides } = useSermonData();

  return (
    <Box>
      {currentSermonSlides?.map(({ content, id }) => (
        <BibleEntityItem key={id} name={content} onClick={() => true} selected={false} />
      ))}
    </Box>
  );
};

export default SermonParagraphsView;
