import React from 'react';

import { BibleBook } from 'src/utils/gql/types';

import BibleEntityItem from './BibleEntityItem';
import { BibleBookSelectWrapper } from './styled';

interface BibleBookSelectProps {
  books?: BibleBook[];
  currentBook?: number;
  onBookSelect: (id: string) => void;
}

const BibleBookSelect = ({ books, onBookSelect }: BibleBookSelectProps) => {
  return (
    <BibleBookSelectWrapper>
      {books?.map(({ name, id }) => (
        <BibleEntityItem key={name} name={name} onClick={() => onBookSelect(id)} />
      ))}
    </BibleBookSelectWrapper>
  );
};

export default BibleBookSelect;
