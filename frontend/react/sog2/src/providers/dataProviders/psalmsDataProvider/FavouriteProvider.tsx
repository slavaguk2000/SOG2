import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { useSubscription } from '@apollo/client';

import { favouritePsalmsSubscription } from '../../../utils/gql/queries';
import { Subscription } from '../../../utils/gql/types';
import { FavouriteContextType } from '../../types';

import useReorderPsalmsMutation from './hooks/useReorderPsalmsMutation';
import { psalmDataMapper } from './PsalmsProvider';

import { usePsalmsSelectionData } from './index';

const defaultValue: FavouriteContextType = {
  favouritePsalmsDataMap: {},
  favouriteReady: false,
  handlePsalmsReorder: () => true,
  favouritePsalmsData: [],
};

export const FavouriteContext = createContext<FavouriteContextType>(defaultValue);

FavouriteContext.displayName = 'FavouriteContext';

export const useFavouriteData = () => {
  return useContext(FavouriteContext);
};

const FavouritePsalmsProvider = ({ children }: PropsWithChildren) => {
  const { favouritePsalmsBookId } = usePsalmsSelectionData();

  const { data, loading } = useSubscription<Pick<Subscription, 'favouritePsalms'>>(favouritePsalmsSubscription, {
    fetchPolicy: 'no-cache',
  });

  const favouritePsalmsDataMap = useMemo(
    () =>
      data?.favouritePsalms.reduce((acc: Record<string, boolean>, { psalm: { id } }) => {
        acc[id] = true;

        return acc;
      }, {}) ?? {},
    [data?.favouritePsalms],
  );

  const { handlePsalmsReorder } = useReorderPsalmsMutation({ psalmsBookId: favouritePsalmsBookId });

  const favouritePsalmsData = useMemo(() => data?.favouritePsalms.map(psalmDataMapper) ?? [], [data?.favouritePsalms]);

  return (
    <FavouriteContext.Provider
      value={{
        favouritePsalmsDataMap,
        favouriteReady: !loading,
        handlePsalmsReorder,
        favouritePsalmsData,
      }}
    >
      {children}
    </FavouriteContext.Provider>
  );
};

export default FavouritePsalmsProvider;
