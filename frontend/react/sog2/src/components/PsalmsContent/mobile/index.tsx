import React from 'react';

import { usePsalms } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';

import PsalmsContentMobileFooter from './Footer';
import PsalmsContentMobileHeader from './Header';
import PsalmsList from './PsalmsList';
import { PsalmsContentMobileWrapper } from './styled';

const PsalmsContentMobile = () => {
  const { dataLength } = usePsalms();

  return (
    <PsalmsContentMobileWrapper>
      <PsalmsContentMobileHeader />
      <PsalmsList listSize={dataLength} />
      <PsalmsContentMobileFooter />
    </PsalmsContentMobileWrapper>
  );
};

export default PsalmsContentMobile;
