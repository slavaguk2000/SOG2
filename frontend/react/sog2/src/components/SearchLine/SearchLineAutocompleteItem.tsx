import React from 'react';

import { Slide } from '../../utils/gql/types';

import { SearchLineAutocompleteItemWrapper } from './styled';

interface SearchLineAutocompleteItemProps {
  slide: Slide;
}

const SearchLineAutocompleteItem = ({ slide: { content } }: SearchLineAutocompleteItemProps) => {
  return <SearchLineAutocompleteItemWrapper>{content}</SearchLineAutocompleteItemWrapper>;
};

export default SearchLineAutocompleteItem;
