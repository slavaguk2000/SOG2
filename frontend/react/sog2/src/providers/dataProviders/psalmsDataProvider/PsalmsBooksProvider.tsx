import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { psalmsBooks } from '../../../utils/gql/queries';
import { Query } from '../../../utils/gql/types';
import { PsalmsBooksContextType } from '../../types';

import { usePsalmsSelectionData } from './index';

export const PsalmsBooksContext = createContext<PsalmsBooksContextType>({});

PsalmsBooksContext.displayName = 'PsalmsBooksContext';

export const usePsalmsBooksData = () => {
  return useContext(PsalmsBooksContext);
};

const PsalmsBooksProvider = ({ children }: PropsWithChildren) => {
  const { psalmsBookId, handlePsalmsBookSelect, favouritePsalmsBookId, setFavouritePsalmsBookId } =
    usePsalmsSelectionData();

  const { data: psalmsBooksData } = useQuery<Pick<Query, 'psalmsBooks'>>(psalmsBooks, {
    fetchPolicy: 'cache-first',
  });

  const currentFavouritePsalmsBookId = useMemo(
    () => psalmsBooksData?.psalmsBooks.find(({ isFavourite }) => isFavourite)?.id,
    [psalmsBooksData],
  );

  useEffect(() => {
    if (currentFavouritePsalmsBookId !== favouritePsalmsBookId) {
      setFavouritePsalmsBookId(currentFavouritePsalmsBookId);
    }
  }, [setFavouritePsalmsBookId, favouritePsalmsBookId, currentFavouritePsalmsBookId]);

  const currentPsalmBook = useMemo(
    () => psalmsBooksData?.psalmsBooks.find(({ id }) => psalmsBookId === id),
    [psalmsBookId, psalmsBooksData?.psalmsBooks],
  );

  useEffect(() => {
    const potentialValidPsalmsBooks = psalmsBooksData?.psalmsBooks?.filter(({ psalmsCount }) => psalmsCount);

    if (currentPsalmBook && !(psalmsBookId && currentPsalmBook.psalmsCount) && potentialValidPsalmsBooks?.[0]?.id) {
      handlePsalmsBookSelect(potentialValidPsalmsBooks[0].id);
    }
  }, [currentPsalmBook, handlePsalmsBookSelect, psalmsBookId, psalmsBooksData?.psalmsBooks]);

  return (
    <PsalmsBooksContext.Provider
      value={{
        psalmsBooksData: psalmsBooksData?.psalmsBooks,
        currentPsalmBook,
      }}
    >
      {children}
    </PsalmsBooksContext.Provider>
  );
};

export default PsalmsBooksProvider;
