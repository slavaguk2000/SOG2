import React from 'react';

import { BibleEntityItemWrapper } from './styled';

interface BibleEntityItemProps {
  name: string;
  onClick: () => void;
}

const BibleEntityItem = ({ name, onClick }: BibleEntityItemProps) => {
  return <BibleEntityItemWrapper onClick={onClick}>{name}</BibleEntityItemWrapper>;
};

export default BibleEntityItem;
