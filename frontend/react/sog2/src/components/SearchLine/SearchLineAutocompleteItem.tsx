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
  slide: { searchContent },
  onClick,
  selected,
  setSelected,
}: SearchLineAutocompleteItemProps) => {
  return (
    <SearchLineAutocompleteItemWrapper onClick={onClick} selected={selected} onMouseEnter={setSelected}>
      {searchContent}
    </SearchLineAutocompleteItemWrapper>
  );
};

export default SearchLineAutocompleteItem;
