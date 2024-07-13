import React from 'react';

import { ListItemButton } from '@mui/material';

import { Slide } from '../../../../utils/gql/types';
import SearchLineAutocompleteItem from '../../../SearchLine/SearchLineAutocompleteItem';

import { StyledSearchResultList } from './styled';

interface SearchResultListProps {
  options: Slide[];
}

const SearchResultList = ({ options }: SearchResultListProps) => {
  return (
    <StyledSearchResultList>
      {options.map((slide) => (
        <ListItemButton key={slide.id}>
          <SearchLineAutocompleteItem slide={slide} />
        </ListItemButton>
      ))}
    </StyledSearchResultList>
  );
};

export default SearchResultList;
