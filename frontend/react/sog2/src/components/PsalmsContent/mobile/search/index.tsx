import React from 'react';

import SearchIcon from '@mui/icons-material/Search';

import { SearchIconWrapper, SearchWrapper, StyledInputBase } from './styled';

export interface SearchProps {
  searchText: string;
  handleSearchTextChange: (newValue: string) => void;
}

const Search = ({ searchText, handleSearchTextChange }: SearchProps) => {
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
          handleSearchTextChange(event.target.value);
        }}
      />
    </SearchWrapper>
  );
};

export default Search;
