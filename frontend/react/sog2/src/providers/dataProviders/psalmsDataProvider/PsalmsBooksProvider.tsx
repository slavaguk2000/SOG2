import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import useSelectIntent from '../../../hooks/useSelectIntent';
import { psalmsBooks } from '../../../utils/gql/queries';
import { Query } from '../../../utils/gql/types';
import { PsalmsBooksContextType } from '../../types';

import { usePsalmsSelectionData } from './index';

export const PsalmsBooksContext = createContext<PsalmsBooksContextType>({
  psalmsBookId: '',
  handlePsalmsBookSelect: () => true,
});

PsalmsBooksContext.displayName = 'PsalmsBooksContext';

export const usePsalmsBooksData = () => {
  return useContext(PsalmsBooksContext);
};

interface PsalmsBooksProviderProps extends PropsWithChildren {
  onPsalmsBookIdUpdate?: (newPsalmBookId: string | undefined) => void;
  storedPsalmsBookId?: string;
}

const PsalmsBooksProvider = ({ children, storedPsalmsBookId, onPsalmsBookIdUpdate }: PsalmsBooksProviderProps) => {
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
  });

  useEffect(() => {
    if (onPsalmsBookIdUpdate && storedPsalmsBookId !== softPsalmsBookIdSelected) {
      onPsalmsBookIdUpdate(softPsalmsBookIdSelected);
    }
  }, [onPsalmsBookIdUpdate, storedPsalmsBookId, softPsalmsBookIdSelected]);

  const { favouritePsalmsBookId, setFavouritePsalmsBookId } = usePsalmsSelectionData();

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
    <PsalmsBooksContext.Provider
      value={{
        psalmsBookId: softPsalmsBookIdSelected ?? '',
        psalmsBooksData: psalmsBooksData?.psalmsBooks,
        handlePsalmsBookSelect: setSoftPsalmsBookIdSelected,
        currentPsalmBook,
      }}
    >
      {children}
    </PsalmsBooksContext.Provider>
  );
};

export default PsalmsBooksProvider;
