import React from 'react';

import PsalmsContentMobileFooter from './Footer';
import PsalmsContentMobileHeader from './Header';
import PsalmsList from './PsalmsList';
import { PsalmsContentMobileWrapper } from './styled';

const PsalmsContentMobile = () => {
  return (
    <PsalmsContentMobileWrapper>
      <PsalmsContentMobileHeader />
      <PsalmsList />
      <PsalmsContentMobileFooter />
    </PsalmsContentMobileWrapper>
  );
};

export default PsalmsContentMobile;
