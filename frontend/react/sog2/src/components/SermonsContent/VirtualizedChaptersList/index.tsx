import React from 'react';

import VirtualizedScroll from '../../VirtualizedScroll/VirtualizedScroll';

import ChaptersDataItemsProvider from './providers/ChaptersDataItemsProvider';
import ChaptersDataLengthProvider from './providers/ChaptersDataLengthProvider';

const VirtualizedChaptersList = () => {
  return (
    <ChaptersDataLengthProvider>
      <ChaptersDataItemsProvider>
        <VirtualizedScroll />
      </ChaptersDataItemsProvider>
    </ChaptersDataLengthProvider>
  );
};

export default VirtualizedChaptersList;
