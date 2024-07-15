import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import TextField from '@mui/material/TextField';

import { Slide, TabType } from 'src/utils/gql/types';

import { useSearchContext } from '../../providers/searchProvider';

import SearchLineAutocompleteItem from './SearchLineAutocompleteItem';
import { SearchLineAutocomplete, SearchLineWrapper } from './styled';

const SearchLine = () => {
  const [autocompleteActive, setAutocompleteActive] = useState<boolean>(false);
  const [selectedProposeIdx, setSelectedProposeIdx] = useState<number>(0);
  const searchLineRef = useRef<HTMLInputElement>(null);
  const [placeSelected, setPlaceSelected] = useState<boolean>(false);

  const { pathname } = useLocation();

  const tabType = pathname === '/bible' ? TabType.Bible : pathname === '/sermon' ? TabType.Sermon : TabType.Psalm;

  const afterSearchTextChanged = () => {
    setSelectedProposeIdx(0);
  };

  const { searchText, setSearchText, handleUpdateLocation, handleUpdateSlide } = useSearchContext();

  const { handleSelectSlide, handleSelectPlace, clearSearchLine, options, hasResults } = useSearchContext();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      clearSearchLine();
    }

    if (e.key === 'Enter') {
      if (options.length) {
        e.stopPropagation();
        const newSlide = options[selectedProposeIdx];
        if (newSlide) {
          if (placeSelected) {
            handleUpdateLocation(newSlide);
          } else {
            handleUpdateSlide(newSlide);
          }
          clearSearchLine();
          (e.target as HTMLInputElement).blur();
        }
      }
    }

    if (options.length) {
      switch (e.key) {
        case 'ArrowDown':
          e.stopPropagation();
          setSelectedProposeIdx((prev) => {
            if (prev < options.length - 1) {
              return prev + 1;
            }

            return prev;
          });

          break;
        case 'ArrowUp':
          e.stopPropagation();
          setSelectedProposeIdx((prev) => {
            if (prev > 0) {
              return prev - 1;
            }

            return prev;
          });

          break;

        case 'ArrowLeft':
          e.stopPropagation();
          setPlaceSelected(true);

          break;

        case 'ArrowRight':
          e.stopPropagation();
          setPlaceSelected(false);

          break;

        default:
          afterSearchTextChanged();
      }
    }
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

  const handleSetSelected = (dataOptionIdx: number | undefined) => {
    if (dataOptionIdx !== undefined) {
      setSelectedProposeIdx(dataOptionIdx);
      setPlaceSelected(false);
    }
  };

  const autocompleteOpen = autocompleteActive && hasResults;

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
        getOptionLabel={(option) => (option as Slide).content ?? ''}
        inputValue={searchText}
        options={options}
        onInputChange={(event, newValue) => {
          setSearchText(newValue);
        }}
        onFocus={() => setAutocompleteActive(true)}
        onBlur={() => setAutocompleteActive(false)}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label={`Search in ${
              tabType === TabType.Bible ? 'Bible' : tabType === TabType.Sermon ? 'Sermons' : 'Psalms'
            }`}
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
              onClick={() => handleSelectSlide(option as Slide)}
              onPlaceClick={() => handleSelectPlace(option as Slide)}
              slide={option as Slide}
              selected={selected}
              placeSelected={placeSelected}
              onPlaceHover={() => setPlaceSelected(true)}
              onPlaceBlur={() => setPlaceSelected(false)}
              setSelected={() => handleSetSelected(dataOptionIdx)}
            />
          );
        }}
      />
    </SearchLineWrapper>
  );
};

export default SearchLine;
