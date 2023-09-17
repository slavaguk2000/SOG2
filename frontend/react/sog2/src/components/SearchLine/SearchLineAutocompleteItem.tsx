import React from 'react';

import { useBibleData } from '../../providers/bibleDataProvider';
import { Slide } from '../../utils/gql/types';

import { SearchLineAutocompleteItemWrapper } from './styled';

interface SearchLineAutocompleteItemProps {
  slide: Slide;
  onClick: () => void;
  selected: boolean;
  setSelected: () => void;
}

const SearchLineAutocompleteItem = ({
  slide: { content, location },
  onClick,
  selected,
  setSelected,
}: SearchLineAutocompleteItemProps) => {
  const { bibleBooksData } = useBibleData();

  const locationLength = location.length;

  const bookIdx = Number(location[locationLength - 3]);

  const book = bibleBooksData && bookIdx !== undefined ? bibleBooksData[bookIdx] : undefined;

  const lineText = `${book?.name} ${location[locationLength - 2]}:${location[locationLength - 1]} ${content}`;

  return (
    <SearchLineAutocompleteItemWrapper onClick={onClick} selected={selected} onMouseEnter={setSelected}>
      {lineText}
    </SearchLineAutocompleteItemWrapper>
  );
};

export default SearchLineAutocompleteItem;
