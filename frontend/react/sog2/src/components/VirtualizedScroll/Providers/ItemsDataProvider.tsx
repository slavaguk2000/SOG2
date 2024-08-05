import React, { createContext, PropsWithChildren, ReactNode, useContext } from 'react';

import { ItemDataProviderContextType } from '../types';

const defaultValue: ItemDataProviderContextType = {
  getItem: () => null,
};

const ItemsDataProviderContext = createContext<ItemDataProviderContextType>(defaultValue);

export const useItemsData = () => useContext(ItemsDataProviderContext);

interface ItemsDataProviderProps extends PropsWithChildren {
  getItem: (index: number) => ReactNode;
  selected?: number;
}

const ItemsDataProvider = ({ children, getItem, selected }: ItemsDataProviderProps) => {
  return (
    <ItemsDataProviderContext.Provider value={{ getItem, selected }}>{children}</ItemsDataProviderContext.Provider>
  );
};

export default ItemsDataProvider;
