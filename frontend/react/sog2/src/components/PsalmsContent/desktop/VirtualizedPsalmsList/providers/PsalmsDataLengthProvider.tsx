import React, { PropsWithChildren } from 'react';

import { usePsalms } from '../../../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';
import DataLengthProvider from '../../../../VirtualizedScroll/Providers/DataLengthProvider';

const PsalmsDataLengthProvider = ({ children }: PropsWithChildren) => {
  const { dataLength } = usePsalms();

  return (
    <DataLengthProvider dataLength={dataLength} minimumItemSize={20} width="20vw">
      {children}
    </DataLengthProvider>
  );
};

export default PsalmsDataLengthProvider;
