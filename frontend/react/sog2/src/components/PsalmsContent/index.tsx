import React from 'react';

import CoupletSelect from './CoupletSelect';
import PsalmBookSelect from './PsalmBookSelect';
import PsalmSelect from './PsalmSelect';
import { PsalmsContentWrapper } from './styled';

const PsalmsContent = () => {
  return (
    <PsalmsContentWrapper>
      <PsalmBookSelect />
      <PsalmSelect />
      <CoupletSelect />
    </PsalmsContentWrapper>
  );
};

export default PsalmsContent;
