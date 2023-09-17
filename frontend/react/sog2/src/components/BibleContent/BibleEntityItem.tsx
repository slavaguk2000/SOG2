import React from 'react';

import { BibleEntityItemWrapper } from './styled';

interface BibleEntityItemProps {
  name: string;
  onClick: () => void;
  selected: boolean;
}

const BibleEntityItem = ({ name, onClick, selected }: BibleEntityItemProps) => {
  return (
    <BibleEntityItemWrapper selected={selected} onClick={onClick}>
      {name}
    </BibleEntityItemWrapper>
  );
};

export default BibleEntityItem;
