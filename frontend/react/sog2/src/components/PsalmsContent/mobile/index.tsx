import React from 'react';

import { usePsalmsSelectionData } from '../../../providers/dataProviders/psalmsDataProvider';
import useSearch from '../../SearchLine/useSearch';

import PsalmsContentMobileFooter from './Footer';
import PsalmsContentMobileHeader from './Header';
import PsalmPreviewDialog from './PsalmPreviewDialog';
import PsalmsContentMobileContextProvider from './PsalmsContentMobileContextProvider';
import PsalmsList from './PsalmsList';
import PsalmViewDrawer from './PsalmViewDrawer';
import SearchResultList from './search/SearchResultList';
import SortablePsalmsList from './SortablePsalmsList';
import { PsalmsContentMobileWrapper } from './styled';

const PsalmsContentMobile = () => {
  const { psalmsBookId, favouritePsalmsBookId } = usePsalmsSelectionData();
  const { searchText, handleSearchTextChange, hasResults: hasSearchResult, options } = useSearch();

  return (
    <PsalmsContentMobileContextProvider>
      <PsalmsContentMobileWrapper>
        <PsalmsContentMobileHeader searchText={searchText} handleSearchTextChange={handleSearchTextChange} />
        {hasSearchResult ? (
          <SearchResultList options={options} />
        ) : psalmsBookId && psalmsBookId === favouritePsalmsBookId ? (
          <SortablePsalmsList />
        ) : (
          <PsalmsList />
        )}
        <PsalmViewDrawer />
        <PsalmPreviewDialog />
        <PsalmsContentMobileFooter />
      </PsalmsContentMobileWrapper>
    </PsalmsContentMobileContextProvider>
  );
};

export default PsalmsContentMobile;
