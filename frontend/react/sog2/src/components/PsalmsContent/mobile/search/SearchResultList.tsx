import React from 'react';

import { ListItemButton } from '@mui/material';

import { Slide } from '../../../../utils/gql/types';
import SearchLineAutocompleteItem from '../../../SearchLine/SearchLineAutocompleteItem';
import useLongPressPreviewChords from '../PsalmPreviewDialog/useLongPressPreviewChords';

import { StyledSearchResultList } from './styled';

interface SearchResultListItemProps {
  slide: Slide;
  onResultItemClick: (newSlide: Slide) => void;
}

const SearchResultListItem = ({ slide, onResultItemClick }: SearchResultListItemProps) => {
  // TODO : decide about getting root transposition
  const longPressAttrs = useLongPressPreviewChords({ psalmId: slide.location?.[1], transposition: 0 });

  return (
    <ListItemButton {...longPressAttrs}>
      <SearchLineAutocompleteItem slide={slide} onClick={() => onResultItemClick(slide)} />
    </ListItemButton>
  );
};

interface SearchResultListProps extends Omit<SearchResultListItemProps, 'slide'> {
  options: Slide[];
}

const SearchResultList = ({ options, onResultItemClick }: SearchResultListProps) => {
  return (
    <StyledSearchResultList>
      {options.map((slide) => (
        <SearchResultListItem key={slide.id} slide={slide} onResultItemClick={onResultItemClick} />
      ))}
    </StyledSearchResultList>
  );
};

export default SearchResultList;
