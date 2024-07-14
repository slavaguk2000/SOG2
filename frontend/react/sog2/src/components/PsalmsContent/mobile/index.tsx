import React, { useState } from 'react';

import { usePsalmsSelectionData } from '../../../providers/dataProviders/psalmsDataProvider';

import FavouritePsalmsList from './FavouritePsalmsList';
import PsalmsContentMobileFooter from './Footer';
import PsalmsContentMobileHeader from './Header';
import PsalmPreviewDialog from './PsalmPreviewDialog';
import PsalmsContentMobileContextProvider from './PsalmsContentMobileContextProvider';
import PsalmsList from './PsalmsList';
import PsalmViewDrawer from './PsalmViewDrawer';
import SearchResultList from './search/SearchResultList';
import { PsalmsContentMobileWrapper } from './styled';

const PsalmsContentMobile = () => {
  const [searchEmpty, setSearchEmpty] = useState(false);
  const { psalmsBookId, favouritePsalmsBookId } = usePsalmsSelectionData();

  return (
    <PsalmsContentMobileContextProvider>
      <PsalmsContentMobileWrapper>
        <PsalmsContentMobileHeader setSearchEmpty={setSearchEmpty} />
        {searchEmpty ? (
          psalmsBookId && psalmsBookId === favouritePsalmsBookId ? (
            <FavouritePsalmsList />
          ) : (
            <PsalmsList />
          )
        ) : (
          <SearchResultList />
        )}
        <PsalmViewDrawer />
        <PsalmPreviewDialog />
        <PsalmsContentMobileFooter />
      </PsalmsContentMobileWrapper>
    </PsalmsContentMobileContextProvider>
  );
};

export default PsalmsContentMobile;
