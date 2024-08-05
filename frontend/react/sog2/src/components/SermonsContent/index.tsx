import React from 'react';

import SermonSelect from './SermonSelect';
import { SermonsContentWrapper } from './styled';
import VirtualizedChaptersList from './VirtualizedChaptersList';

const SermonsContent = () => {
  return (
    <SermonsContentWrapper>
      <SermonSelect />
      <VirtualizedChaptersList />
    </SermonsContentWrapper>
  );
};

export default SermonsContent;
