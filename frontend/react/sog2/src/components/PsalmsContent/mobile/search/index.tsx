import React, { useEffect } from 'react';

import SearchIcon from '@mui/icons-material/Search';

import { useSearchContext } from '../../../../providers/searchProvider';
import { PsalmsContentMobileHeaderProps } from '../Header';

import { SearchIconWrapper, SearchWrapper, StyledInputBase } from './styled';

const Search = ({ setSearchEmpty }: PsalmsContentMobileHeaderProps) => {
  const { searchText, setSearchText, hasResults } = useSearchContext();

  useEffect(() => {
    setSearchEmpty(!hasResults);
  }, [setSearchEmpty, hasResults]);

  return (
    <SearchWrapper>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        value={searchText}
        onChange={(event) => {
          setSearchText(event.target.value);
        }}
      />
    </SearchWrapper>
  );
};

export default Search;
