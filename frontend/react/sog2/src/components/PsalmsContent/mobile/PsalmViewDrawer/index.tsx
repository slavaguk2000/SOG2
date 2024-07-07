import React from 'react';

import { Drawer } from '@mui/material';

import { usePsalmsSelectionData } from '../../../../providers/dataProviders/psalmsDataProvider';
import { usePsalms } from '../../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';

import PsalmViewDrawerBody from './PsalmViewDrawerBody';

const PsalmViewDrawer = () => {
  const { currentPsalm } = usePsalms();
  const { clearPsalmSelect } = usePsalmsSelectionData();

  return (
    <Drawer open={!!currentPsalm} onClose={clearPsalmSelect} anchor="right">
      <PsalmViewDrawerBody />
    </Drawer>
  );
};

export default PsalmViewDrawer;
