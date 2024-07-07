import React, { Context, KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';

import { debounceInputDelay, minimumSearchLength } from 'src/constants/behaviorConstants';
import { search } from 'src/utils/gql/queries';
import { Query, QuerySearchArgs, Slide, TabType } from 'src/utils/gql/types';

import BibleContext from '../../providers/dataProviders/bibleDataProvider/context';
import { PsalmsContext } from '../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';
import SermonDataProviderContext from '../../providers/dataProviders/sermanDataProvider/context';
import { DataProvider } from '../../providers/types';

import SearchLineAutocompleteItem from './SearchLineAutocompleteItem';
import { SearchLineAutocomplete, SearchLineWrapper } from './styled';

const handleSearch = debounce(
  (searchText: string, handleUpdateSearchText: (newSearchText: string) => void) => handleUpdateSearchText(searchText),
  debounceInputDelay,
  { leading: true, trailing: true },
);

const getShouldSkip = (tabType: TabType, searchString: string) => {
  switch (tabType) {
    case TabType.Psalm:
      return !searchString.length;
    default:
      return searchString.length < minimumSearchLength;
  }
};

const getSearchParamKey = (tabType: TabType) => {
  switch (tabType) {
    case TabType.Psalm:
      return 'psalmsBookId';
    case TabType.Bible:
      return 'bibleId';
    default:
      return 'id';
  }
};

const getDataProviderContext = (tabType: TabType) => {
  switch (tabType) {
    case TabType.Psalm:
      return PsalmsContext;
    case TabType.Bible:
      return BibleContext;
    case TabType.Sermon:
      return SermonDataProviderContext;
  }
};

const SearchLine = () => {
  const [searchParams] = useSearchParams();
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [autocompleteActive, setAutocompleteActive] = useState<boolean>(false);
  const [selectedProposeIdx, setSelectedProposeIdx] = useState<number>(0);
  const searchLineRef = useRef<HTMLInputElement>(null);
  const [placeSelected, setPlaceSelected] = useState<boolean>(false);

  const { pathname } = useLocation();

  const tabType = pathname === '/bible' ? TabType.Bible : pathname === '/sermon' ? TabType.Sermon : TabType.Psalm;

  const { data } = useQuery<Pick<Query, 'search'>, QuerySearchArgs>(search, {
    variables: {
      searchPattern: debouncedSearchText,
      tabType,
      id: searchParams.get(getSearchParamKey(tabType)),
    },
    fetchPolicy: 'cache-first',
    skip: getShouldSkip(tabType, debouncedSearchText),
  });

  const options: Slide[] = data?.search ?? [];

  const clearSearchLine = () => {
    setDebouncedSearchText('');
    setSearchText('');
    setSelectedProposeIdx(0);
  };

  const { handleUpdateSlide, handleUpdateLocation } = useContext<DataProvider>(
    getDataProviderContext(tabType) as unknown as Context<DataProvider>,
  );

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

  const handlePlaceClick = (slide: Slide) => {
    clearSearchLine();

    handleUpdateLocation(slide);
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
          handleSearchTextChange(newValue);
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
              onClick={() => handleClickOption(option as Slide)}
              onPlaceClick={() => handlePlaceClick(option as Slide)}
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
