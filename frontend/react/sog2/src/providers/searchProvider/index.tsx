import React, { Context, createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { debounce } from 'lodash';

import { debounceInputDelay, minimumSearchLength } from '../../constants/behaviorConstants';
import { search } from '../../utils/gql/queries';
import { Query, QuerySearchArgs, Slide, TabType } from '../../utils/gql/types';
import BibleContext from '../dataProviders/bibleDataProvider/context';
import { CurrentPsalmContext } from '../dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import SermonDataProviderContext from '../dataProviders/sermanDataProvider/context';
import { DataProvider, SearchContextType } from '../types';

const defaultValue: SearchContextType = {
  handleSelectSlide: () => true,
  handleSelectPlace: () => true,
  clearSearchLine: () => true,
  options: [],
  hasResults: false,
  searchText: '',
  setSearchText: () => true,
  handleUpdateSlide: () => true,
  handleUpdateLocation: () => true,
};

const SearchContext = createContext<SearchContextType>(defaultValue);

SearchContext.displayName = 'SearchContext';

export const useSearchContext = () => {
  return useContext(SearchContext);
};

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
      return CurrentPsalmContext;
    case TabType.Bible:
      return BibleContext;
    case TabType.Sermon:
      return SermonDataProviderContext;
  }
};

interface SearchContextProviderProps extends PropsWithChildren {
  tabType: TabType;
}

const SearchContextProvider = ({ children, tabType }: SearchContextProviderProps) => {
  const [searchParams] = useSearchParams();
  const { handleUpdateSlide, handleUpdateLocation } = useContext<DataProvider>(
    getDataProviderContext(tabType) as unknown as Context<DataProvider>,
  );

  const [searchText, setSearchText] = useState<string>('');
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>('');

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
  };

  const handleSearchTextChange = useCallback((newValue: string) => {
    handleSearch(newValue, setDebouncedSearchText);
  }, []);

  useEffect(() => {
    handleSearchTextChange(searchText);
  }, [handleSearchTextChange, searchText]);

  const handleSelectSlide = (newSlide: Slide) => {
    clearSearchLine();

    handleUpdateSlide(newSlide);
  };

  const handleSelectPlace = (slide: Slide) => {
    clearSearchLine();

    handleUpdateLocation(slide);
  };

  const hasResults = Boolean(debouncedSearchText && options.length);

  return (
    <SearchContext.Provider
      value={{
        handleSelectSlide,
        handleSelectPlace,
        clearSearchLine,
        options,
        hasResults,
        searchText,
        setSearchText,
        handleUpdateSlide,
        handleUpdateLocation,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
