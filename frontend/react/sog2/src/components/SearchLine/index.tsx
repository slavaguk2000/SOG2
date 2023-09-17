import React, { KeyboardEvent, useState } from 'react';

import { useQuery } from '@apollo/client';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';

import { debounceInputDelay, minimumSearchLength } from 'src/constants/behaviorConstants';
import { search } from 'src/utils/gql/queries';
import { Query, QuerySearchArgs, Slide } from 'src/utils/gql/types';

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

  const { data } = useQuery<Pick<Query, 'search'>, QuerySearchArgs>(search, {
    variables: {
      searchPattern: debouncedSearchText,
    },
    fetchPolicy: 'cache-first',
    skip: debouncedSearchText.length < minimumSearchLength,
  });

  const options: Slide[] = data?.search ?? [];

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setDebouncedSearchText('');
      setSearchText('');
    }
  };

  const handleSearchTextChange = (newValue: string) => {
    setSearchText(newValue);
    handleSearch(newValue, setDebouncedSearchText);
  };

  const autocompleteOpen = Boolean(autocompleteActive && debouncedSearchText && options.length);

  return (
    <SearchLineWrapper>
      <SearchLineAutocomplete
        open={autocompleteOpen}
        freeSolo
        fullWidth
        getOptionLabel={(option) => (option as Slide).content}
        inputValue={searchText}
        options={options}
        onInputChange={(event, newValue) => {
          handleSearchTextChange(newValue);
        }}
        onFocus={() => setAutocompleteActive(true)}
        onBlur={() => setAutocompleteActive(false)}
        renderInput={(params) => (
          <TextField {...params} size="small" label="Search the Bible" onKeyDown={handleKeyDown} />
        )}
        renderOption={(_, option) => <SearchLineAutocompleteItem slide={option as Slide} />}
      />
    </SearchLineWrapper>
  );
};

export default SearchLine;
