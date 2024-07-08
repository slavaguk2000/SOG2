import React from 'react';

import { SwipeableDrawer } from '@mui/material';

import { useCurrentPsalms } from '../../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';

import PsalmViewDrawerBody from './PsalmViewDrawerBody';

const PsalmViewDrawer = () => {
  const { currentPsalm, clearPsalmSelect } = useCurrentPsalms();

  return (
    <SwipeableDrawer
      disableSwipeToOpen
      open={!!currentPsalm}
      onClose={clearPsalmSelect}
      onOpen={() => true}
      anchor="right"
    >
      {currentPsalm && <PsalmViewDrawerBody />}
    </SwipeableDrawer>
  );
};

export default PsalmViewDrawer;
