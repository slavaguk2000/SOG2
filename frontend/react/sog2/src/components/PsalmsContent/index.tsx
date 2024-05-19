import React from 'react';

import CoupletSelect from './CoupletSelect';
import PsalmSelect from './PsalmSelect';
import { PsalmsContentWrapper } from './styled';

const PsalmsContent = () => {
  return (
    <PsalmsContentWrapper>
      <PsalmSelect />
      <CoupletSelect />
    </PsalmsContentWrapper>
  );
};

export default PsalmsContent;
