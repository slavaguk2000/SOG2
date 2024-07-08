import React from 'react';

import PsalmsContentMobileFooter from './Footer';
import PsalmsContentMobileHeader from './Header';
import PsalmPreviewDialog from './PsalmPreviewDialog';
import PsalmsContentMobileContextProvider from './PsalmsContentMobileContextProvider';
import PsalmsList from './PsalmsList';
import PsalmViewDrawer from './PsalmViewDrawer';
import { PsalmsContentMobileWrapper } from './styled';

const PsalmsContentMobile = () => {
  return (
    <PsalmsContentMobileContextProvider>
      <PsalmsContentMobileWrapper>
        <PsalmsContentMobileHeader />
        <PsalmsList />
        <PsalmViewDrawer />
        <PsalmPreviewDialog />
        <PsalmsContentMobileFooter />
      </PsalmsContentMobileWrapper>
    </PsalmsContentMobileContextProvider>
  );
};

export default PsalmsContentMobile;
