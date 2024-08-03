import React from 'react';

import { SermonSelectWrapper } from './styled';
import VirtualizedSermonsList from './VirtualizedSermonsList';

const SermonsSelect = () => {
  return (
    <SermonSelectWrapper>
      <VirtualizedSermonsList />
    </SermonSelectWrapper>
  );
};

export default SermonsSelect;
