import React, { PropsWithChildren } from 'react';

import DataLengthProvider from 'src/components/VirtualizedScroll/Providers/DataLengthProvider';

import { useChapters } from '../../../../providers/dataProviders/sermanDataProvider/ChaptersProvider';

const ChaptersDataLengthProvider = ({ children }: PropsWithChildren) => {
  const { dataLength } = useChapters();

  return (
    <DataLengthProvider dataLength={dataLength} minimumItemSize={20} width="80vw">
      {children}
    </DataLengthProvider>
  );
};

export default ChaptersDataLengthProvider;
