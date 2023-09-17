import React from 'react';

import { BibleBook } from 'src/utils/gql/types';

import BibleEntityItem from './BibleEntityItem';
import { BibleBookSelectWrapper } from './styled';

interface BibleBookSelectProps {
  books?: BibleBook[];
  currentBookIdx?: number;
  onBookSelect: (id: string) => void;
}

const BibleBookSelect = ({ books, onBookSelect, currentBookIdx }: BibleBookSelectProps) => {
  return (
    <BibleBookSelectWrapper>
      {books?.map(({ name, id }, idx) => (
        <BibleEntityItem key={name} name={name} onClick={() => onBookSelect(id)} selected={idx === currentBookIdx} />
      ))}
    </BibleBookSelectWrapper>
  );
};

export default BibleBookSelect;
