import React from 'react';

import PsalmsContentMobileFooter from './Footer';
import PsalmsContentMobileHeader from './Header';
import PsalmsList from './PsalmsList';
import PsalmViewDrawer from './PsalmViewDrawer';
import { PsalmsContentMobileWrapper } from './styled';

const PsalmsContentMobile = () => {
  return (
    <PsalmsContentMobileWrapper>
      <PsalmsContentMobileHeader />
      <PsalmsList />
      <PsalmViewDrawer />
      <PsalmsContentMobileFooter />
    </PsalmsContentMobileWrapper>
  );
};

export default PsalmsContentMobile;
