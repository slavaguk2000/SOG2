import React, { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useMutation } from '@apollo/client';

import useSelectIntent from '../../../hooks/useSelectIntent';
import { setActivePsalm } from '../../../utils/gql/queries';
import { Mutation, MutationSetActivePsalmArgs } from '../../../utils/gql/types';
import { useInstrumentsField } from '../../instrumentsFieldProvider';
import { PsalmsDataSelectContextType } from '../../types';

import FavouritePsalmsProvider from './FavouriteProvider';
import PsalmsBooksProvider from './PsalmsBooksProvider';
import PsalmsProvider from './PsalmsProvider';

const defaultValue: PsalmsDataSelectContextType = {
  psalmId: '',
  psalmsBookId: '',
  handlePsalmSelect: () => true,
  clearPsalmSelect: () => true,
  handlePsalmsBookSelect: () => true,
  setFavouritePsalmsBookId: () => true,
};

export const PsalmsDataSelectContext = createContext<PsalmsDataSelectContextType>(defaultValue);

PsalmsDataSelectContext.displayName = 'PsalmsDataSelectContext';

export const usePsalmsSelectionData = () => {
  return useContext(PsalmsDataSelectContext);
};

const PsalmsDataProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const psalmsBookId = searchParams.get('psalmsBookId') ?? '';
  const psalmId = searchParams.get('psalmId') ?? '';

  const [favouritePsalmsBookId, setFavouritePsalmsBookId] = useState<string | undefined>();

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

  const [setActivePsalmMutation] = useMutation<Pick<Mutation, 'setActivePsalm'>, MutationSetActivePsalmArgs>(
    setActivePsalm,
  );

  const { silentMode } = useInstrumentsField();

  const handlePsalmSelect = useCallback(
    (id: string, transposition?: number) => {
      setSearchParams((prev) => {
        prev.set('psalmId', id);

        return prev;
      });
      if (!silentMode) {
        setActivePsalmMutation({
          variables: {
            psalmId: id,
            psalmsBookId,
            transposition,
          },
        }).catch((e) => console.error(e));
      }
    },
    [setSearchParams, silentMode, setActivePsalmMutation, psalmsBookId],
  );

  const { softSelected: softPsalmIdSelected, setSoftSelected: setSoftPsalmIdSelected } = useSelectIntent({
    hardSelected: psalmId,
    setHardSelected: handlePsalmSelect,
    timeout: 100,
  });

  const clearPsalmSelect = () => {
    setSearchParams((prev) => {
      prev.delete('psalmId');

      return prev;
    });
  };

  return (
    <PsalmsDataSelectContext.Provider
      value={{
        psalmsBookId: softPsalmsBookIdSelected ?? '',
        psalmId: softPsalmIdSelected ?? '',
        favouritePsalmsBookId,
        handlePsalmsBookSelect: setSoftPsalmsBookIdSelected,
        handlePsalmSelect: setSoftPsalmIdSelected,
        setFavouritePsalmsBookId,
        clearPsalmSelect,
      }}
    >
      <PsalmsBooksProvider>
        <FavouritePsalmsProvider>
          <PsalmsProvider>{children}</PsalmsProvider>
        </FavouritePsalmsProvider>
      </PsalmsBooksProvider>
    </PsalmsDataSelectContext.Provider>
  );
};

export default PsalmsDataProvider;
