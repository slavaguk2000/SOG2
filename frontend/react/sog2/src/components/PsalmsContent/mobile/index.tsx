import React from 'react';

import { usePsalmsSelectionData } from '../../../providers/dataProviders/psalmsDataProvider';

import PsalmsContentMobileFooter from './Footer';
import PsalmsContentMobileHeader from './Header';
import PsalmPreviewDialog from './PsalmPreviewDialog';
import PsalmsContentMobileContextProvider from './PsalmsContentMobileContextProvider';
import PsalmsList from './PsalmsList';
import PsalmViewDrawer from './PsalmViewDrawer';
import SortablePsalmsList from './SortablePsalmsList';
import { PsalmsContentMobileWrapper } from './styled';

const PsalmsContentMobile = () => {
  const { psalmsBookId, favouritePsalmsBookId } = usePsalmsSelectionData();

  return (
    <PsalmsContentMobileContextProvider>
      <PsalmsContentMobileWrapper>
        <PsalmsContentMobileHeader />
        {psalmsBookId && psalmsBookId === favouritePsalmsBookId ? <SortablePsalmsList /> : <PsalmsList />}
        <PsalmViewDrawer />
        <PsalmPreviewDialog />
        <PsalmsContentMobileFooter />
      </PsalmsContentMobileWrapper>
    </PsalmsContentMobileContextProvider>
  );
};

export default PsalmsContentMobile;
