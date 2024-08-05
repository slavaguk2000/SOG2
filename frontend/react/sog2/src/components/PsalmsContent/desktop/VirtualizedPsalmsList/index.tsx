import React from 'react';

import VirtualizedScroll from '../../../VirtualizedScroll/VirtualizedScroll';

import PsalmsDataItemsProvider from './providers/PsalmsDataItemsProvider';
import PsalmsDataLengthProvider from './providers/PsalmsDataLengthProvider';

const VirtualizedPsalmsList = () => {
  return (
    <PsalmsDataLengthProvider>
      <PsalmsDataItemsProvider>
        <VirtualizedScroll />
      </PsalmsDataItemsProvider>
    </PsalmsDataLengthProvider>
  );
};

export default VirtualizedPsalmsList;
