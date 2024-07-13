import { Context, useContext, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { debounce } from 'lodash';

import { debounceInputDelay, minimumSearchLength } from '../../constants/behaviorConstants';
import BibleContext from '../../providers/dataProviders/bibleDataProvider/context';
import { CurrentPsalmContext } from '../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import SermonDataProviderContext from '../../providers/dataProviders/sermanDataProvider/context';
import { DataProvider } from '../../providers/types';
import { search } from '../../utils/gql/queries';
import { Query, QuerySearchArgs, Slide, TabType } from '../../utils/gql/types';

interface UseSearchProps {
  afterSearchTextChanged?: () => void;
}

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

const useSearch = ({ afterSearchTextChanged }: UseSearchProps = {}) => {
  const [searchParams] = useSearchParams();
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

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

  const { handleUpdateSlide, handleUpdateLocation } = useContext<DataProvider>(
    getDataProviderContext(tabType) as unknown as Context<DataProvider>,
  );

  const clearSearchLine = () => {
    setDebouncedSearchText('');
    setSearchText('');
    afterSearchTextChanged?.();
  };

  const handleSearchTextChange = (newValue: string) => {
    setSearchText(newValue);
    handleSearch(newValue, setDebouncedSearchText);
    afterSearchTextChanged?.();
  };

  const handleSelectSlide = (newSlide: Slide) => {
    clearSearchLine();

    handleUpdateSlide(newSlide);
  };

  const handleSelectPlace = (slide: Slide) => {
    clearSearchLine();

    handleUpdateLocation(slide);
  };

  const hasResults = Boolean(debouncedSearchText && options.length);

  return {
    handleSearchTextChange,
    handleSelectSlide,
    handleSelectPlace,
    clearSearchLine,
    options,
    hasResults,
    searchText,
    // refactor search context, and remove methods from here
    handleUpdateSlide,
    handleUpdateLocation,
  };
};

export default useSearch;
