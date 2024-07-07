import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import useSelectIntent from '../../../hooks/useSelectIntent';
import { psalmsBooks } from '../../../utils/gql/queries';
import { Query } from '../../../utils/gql/types';
import { PsalmsDataContextType } from '../../types';

import FavouritePsalmsProvider from './FavouriteProvider';

const defaultValue: PsalmsDataContextType = {
  psalmsBookId: '0',
  handlePsalmBookSelect: () => true,
};

export const PsalmsDataContext = createContext<PsalmsDataContextType>(defaultValue);

PsalmsDataContext.displayName = 'PsalmsDataContext';

export const usePsalmsData = () => {
  return useContext(PsalmsDataContext);
};

const PsalmsDataProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const psalmsBookId = searchParams.get('psalmsBookId') ?? '';

  const handlePsalmBookSelect = useCallback(
    (id: string) => {
      setSearchParams((prev) => {
        prev.set('psalmsBookId', id);

        return prev;
      });
    },
    [setSearchParams],
  );

  const { softSelected: softPsalmsBookIdSelected, setSoftSelected: setSoftPsalmsBookIdSelected } = useSelectIntent({
    hardSelected: psalmsBookId,
    setHardSelected: handlePsalmBookSelect,
    timeout: 100,
  });

  const { data: psalmsBooksData } = useQuery<Pick<Query, 'psalmsBooks'>>(psalmsBooks, {
    fetchPolicy: 'cache-first',
  });

  const favouritePsalmsBookId = useMemo(
    () => psalmsBooksData?.psalmsBooks.find(({ isFavourite }) => isFavourite)?.id,
    [psalmsBooksData],
  );

  const currentPsalmBook = useMemo(
    () => psalmsBooksData?.psalmsBooks.find(({ id }) => softPsalmsBookIdSelected === id),
    [softPsalmsBookIdSelected, psalmsBooksData?.psalmsBooks],
  );

  useEffect(() => {
    const potentialValidPsalmsBooks = psalmsBooksData?.psalmsBooks?.filter(({ psalmsCount }) => psalmsCount);

    if (
      currentPsalmBook &&
      !(softPsalmsBookIdSelected && currentPsalmBook.psalmsCount) &&
      potentialValidPsalmsBooks?.[0]?.id
    ) {
      setSoftPsalmsBookIdSelected(potentialValidPsalmsBooks[0].id);
    }
  }, [currentPsalmBook, setSoftPsalmsBookIdSelected, softPsalmsBookIdSelected, psalmsBooksData?.psalmsBooks]);

  return (
    <PsalmsDataContext.Provider
      value={{
        psalmsBookId: softPsalmsBookIdSelected ?? '',
        psalmsBooksData: psalmsBooksData?.psalmsBooks,
        currentPsalmBook,
        handlePsalmBookSelect: setSoftPsalmsBookIdSelected,
      }}
    >
      <FavouritePsalmsProvider favouritePsalmsBookId={favouritePsalmsBookId}>{children}</FavouritePsalmsProvider>
    </PsalmsDataContext.Provider>
  );
};

export default PsalmsDataProvider;
