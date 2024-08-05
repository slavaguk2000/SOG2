import React, { createContext, PropsWithChildren, useContext } from 'react';

import { DataLengthProviderContextType } from '../types';

const defaultValue: DataLengthProviderContextType = {
  dataLength: 0,
  minimumItemSize: 30,
  width: '100%',
};

const DataLengthProviderContext = createContext<DataLengthProviderContextType>(defaultValue);

export const useItemsDataLength = () => useContext(DataLengthProviderContext);

interface DataLengthProviderProps extends PropsWithChildren {
  dataLength: number;
  minimumItemSize: number;
  width: string;
}

const DataLengthProvider = ({ children, dataLength, minimumItemSize, width }: DataLengthProviderProps) => {
  return (
    <DataLengthProviderContext.Provider value={{ dataLength: dataLength ?? 0, minimumItemSize, width }}>
      {children}
    </DataLengthProviderContext.Provider>
  );
};

export default DataLengthProvider;
