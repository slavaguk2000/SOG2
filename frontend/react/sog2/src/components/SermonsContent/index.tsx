import React from 'react';

import SermonChapterSelect from './SermonChapterSelect';
import SermonSelect from './SermonSelect';
import { SermonsContentWrapper } from './styled';

const SermonsContent = () => {
  return (
    <SermonsContentWrapper>
      <SermonSelect />
      <SermonChapterSelect />
    </SermonsContentWrapper>
  );
};

export default SermonsContent;
