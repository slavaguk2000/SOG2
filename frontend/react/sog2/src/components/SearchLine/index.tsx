import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';

import { useQuery } from '@apollo/client';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';

import { debounceInputDelay, minimumSearchLength } from 'src/constants/behaviorConstants';
import { search } from 'src/utils/gql/queries';
import { Query, QuerySearchArgs, Slide } from 'src/utils/gql/types';

import { useBibleData } from '../../providers/bibleDataProvider';

import SearchLineAutocompleteItem from './SearchLineAutocompleteItem';
import { SearchLineAutocomplete, SearchLineWrapper } from './styled';

const handleSearch = debounce(
  (searchText: string, handleUpdateSearchText: (newSearchText: string) => void) => handleUpdateSearchText(searchText),
  debounceInputDelay,
  { leading: true, trailing: true },
);

const SearchLine = () => {
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [autocompleteActive, setAutocompleteActive] = useState<boolean>(false);
  const [selectedProposeIdx, setSelectedProposeIdx] = useState<number>(0);
  const searchLineRef = useRef<HTMLInputElement>(null);

  const { data } = useQuery<Pick<Query, 'search'>, QuerySearchArgs>(search, {
    variables: {
      searchPattern: debouncedSearchText,
    },
    fetchPolicy: 'cache-first',
    skip: debouncedSearchText.length < minimumSearchLength,
  });

  const options: Slide[] = data?.search ?? [];

  const clearSearchLine = () => {
    setDebouncedSearchText('');
    setSearchText('');
    setSelectedProposeIdx(0);
  };

  const { handleUpdateSlide } = useBibleData();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      clearSearchLine();
    }

    if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
      if (options.length) {
        const newSlide = options[selectedProposeIdx];
        if (newSlide) {
          handleUpdateSlide(newSlide);
          clearSearchLine();
          (e.target as HTMLInputElement).blur();
        }
      }
    }

    if (options.length) {
      if (e.key === 'ArrowDown') {
        setSelectedProposeIdx((prev) => {
          if (prev < options.length - 1) {
            return prev + 1;
          }

          return prev;
        });
      }

      if (e.key === 'ArrowUp') {
        setSelectedProposeIdx((prev) => {
          if (prev > 0) {
            return prev - 1;
          }

          return prev;
        });
      }
    }
  };

  const handleSearchTextChange = (newValue: string) => {
    setSearchText(newValue);
    handleSearch(newValue, setDebouncedSearchText);
    setSelectedProposeIdx(0);
  };

  const autocompleteOpen = Boolean(autocompleteActive && debouncedSearchText && options.length);

  const handleClickOption = (newSlide: Slide) => {
    clearSearchLine();

    handleUpdateSlide(newSlide);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: WindowEventMap['keydown']) => {
      const isLetter = event.key.length === 1 && /[1-4a-zA-Zа-яА-ЯёЁ]/.test(event.key);

      const isSpace = event.key === ' ';
      if (isLetter || isSpace) {
        if (searchLineRef.current && document.activeElement !== searchLineRef.current) {
          searchLineRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  return (
    <SearchLineWrapper>
      <SearchLineAutocomplete
        open={autocompleteOpen}
        freeSolo
        clearOnBlur
        clearOnEscape
        fullWidth
        filterOptions={(options) => options} //need to show popup on "Gen 2 5" for example
        autoComplete
        autoHighlight
        getOptionLabel={(option) => (option as Slide).content}
        inputValue={searchText}
        options={options}
        onInputChange={(event, newValue) => {
          handleSearchTextChange(newValue);
        }}
        onFocus={() => setAutocompleteActive(true)}
        onBlur={() => setAutocompleteActive(false)}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Search the Bible"
            onKeyDown={handleKeyDown}
            inputRef={searchLineRef}
          />
        )}
        renderOption={(props, option) => {
          // eslint-disable-next-line react/prop-types
          const dataOptionIdx = (props as { 'data-option-index'?: number })['data-option-index'];
          // eslint-disable-next-line react/prop-types
          const key = (props as { id: string }).id;

          const selected = dataOptionIdx === selectedProposeIdx;

          return (
            <SearchLineAutocompleteItem
              key={key}
              onClick={() => handleClickOption(option as Slide)}
              slide={option as Slide}
              selected={selected}
              setSelected={() => dataOptionIdx !== undefined && setSelectedProposeIdx(dataOptionIdx)}
            />
          );
        }}
      />
    </SearchLineWrapper>
  );
};

export default SearchLine;
