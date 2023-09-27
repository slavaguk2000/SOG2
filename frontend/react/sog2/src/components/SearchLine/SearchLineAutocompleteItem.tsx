import React from 'react';

import { Slide } from '../../utils/gql/types';

import { SearchLineAutocompleteItemWrapper } from './styled';

interface SearchLineAutocompleteItemProps {
  slide: Slide;
  onClick: () => void;
  selected: boolean;
  setSelected: () => void;
}

const SearchLineAutocompleteItem = ({
  slide: { searchContent, content },
  onClick,
  selected,
  setSelected,
}: SearchLineAutocompleteItemProps) => {
  return (
    <SearchLineAutocompleteItemWrapper onClick={onClick} selected={selected} onMouseEnter={setSelected}>
      {searchContent ? <div dangerouslySetInnerHTML={{ __html: searchContent }} /> : content}
    </SearchLineAutocompleteItemWrapper>
  );
};

export default SearchLineAutocompleteItem;
