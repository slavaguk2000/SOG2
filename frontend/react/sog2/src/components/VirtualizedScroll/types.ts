import { ReactNode } from 'react';

export interface DataLengthProviderContextType {
  dataLength: number;
  minimumItemSize: number;
  width: string;
}

export interface ItemDataProviderContextType {
  getItem: (index: number) => ReactNode;
  selected?: number;
}
