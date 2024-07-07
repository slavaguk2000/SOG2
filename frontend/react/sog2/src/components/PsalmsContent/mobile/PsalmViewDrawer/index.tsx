import React from 'react';

import { Drawer } from '@mui/material';

import { useCurrentPsalms } from '../../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';

import PsalmViewDrawerBody from './PsalmViewDrawerBody';

const PsalmViewDrawer = () => {
  const { currentPsalm, clearPsalmSelect } = useCurrentPsalms();

  return (
    <Drawer open={!!currentPsalm} onClose={clearPsalmSelect} anchor="right">
      <PsalmViewDrawerBody />
    </Drawer>
  );
};

export default PsalmViewDrawer;
