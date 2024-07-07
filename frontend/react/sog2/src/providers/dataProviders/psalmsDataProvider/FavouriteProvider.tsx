import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { psalms } from '../../../utils/gql/queries';
import { Query, QueryPsalmsArgs } from '../../../utils/gql/types';
import { FavouriteContextType } from '../../types';

import { usePsalmsSelectionData } from './index';

const defaultValue: FavouriteContextType = {
  favouritePsalmsDataMap: {},
};

export const FavouriteContext = createContext<FavouriteContextType>(defaultValue);

FavouriteContext.displayName = 'FavouriteContext';

export const useFavouriteData = () => {
  return useContext(FavouriteContext);
};

const FavouritePsalmsProvider = ({ children }: PropsWithChildren) => {
  const { favouritePsalmsBookId } = usePsalmsSelectionData();

  const { data: favouritePsalmsQueryData } = useQuery<Pick<Query, 'psalms'>, QueryPsalmsArgs>(psalms, {
    variables: {
      psalmsBookId: favouritePsalmsBookId ?? '',
    },
    fetchPolicy: 'cache-first',
    skip: !favouritePsalmsBookId,
  });

  const favouritePsalmsDataMap = useMemo(
    () =>
      favouritePsalmsQueryData?.psalms.reduce((acc: Record<string, boolean>, { psalm: { id } }) => {
        acc[id] = true;

        return acc;
      }, {}) ?? {},
    [favouritePsalmsQueryData?.psalms],
  );

  return (
    <FavouriteContext.Provider
      value={{
        favouritePsalmsBookId,
        favouritePsalmsDataMap,
      }}
    >
      {children}
    </FavouriteContext.Provider>
  );
};

export default FavouritePsalmsProvider;
