import React from 'react';

import { ListItemButton } from '@mui/material';

import { Slide } from '../../../../utils/gql/types';
import SearchLineAutocompleteItem from '../../../SearchLine/SearchLineAutocompleteItem';
import useSearch from '../../../SearchLine/useSearch';
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

const SearchResultList = () => {
  const { options, handleSelectSlide } = useSearch();

  return (
    <StyledSearchResultList>
      {options.map((slide) => (
        <SearchResultListItem key={slide.id} slide={slide} onResultItemClick={handleSelectSlide} />
      ))}
    </StyledSearchResultList>
  );
};

export default SearchResultList;
