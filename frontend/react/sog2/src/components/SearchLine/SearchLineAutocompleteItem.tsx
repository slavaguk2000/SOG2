import React, { useEffect, useRef } from 'react';

import { Slide } from 'src/utils/gql/types';

import SearchLineAutocompleteItemContent from './SearchLineAutocompleteItemContent';
import SearchLineFavourite from './SearchLineFavourite';
import { SearchLineAutocompleteItemWrapper } from './styled';

interface SearchLineAutocompleteItemProps {
  slide: Slide;
  onPlaceClick?: () => void;
  onClick?: () => void;
  selected?: boolean;
  setSelected?: () => void;
  onPlaceHover?: () => void;
  onPlaceBlur?: () => void;
  placeSelected?: boolean;
}

const SearchLineAutocompleteItem = ({
  slide: { searchContent, content, location },
  onClick,
  onPlaceClick,
  onPlaceBlur,
  selected,
  setSelected,
  onPlaceHover,
  placeSelected,
}: SearchLineAutocompleteItemProps) => {
  const itemRef = useRef(null);

  useEffect(() => {
    if (selected && itemRef.current) {
      (itemRef.current as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selected]);

  return (
    <SearchLineAutocompleteItemWrapper
      onClick={onClick}
      selected={!(!selected || placeSelected)}
      onMouseEnter={setSelected}
      ref={itemRef}
    >
      {location && <SearchLineFavourite location={location} />}
      {searchContent ? (
        <SearchLineAutocompleteItemContent
          onPlaceHover={onPlaceHover}
          searchContent={searchContent}
          onPlaceClick={onPlaceClick}
          onPlaceBlur={onPlaceBlur}
          placeSelected={selected && placeSelected}
        />
      ) : (
        content
      )}
    </SearchLineAutocompleteItemWrapper>
  );
};

export default SearchLineAutocompleteItem;
