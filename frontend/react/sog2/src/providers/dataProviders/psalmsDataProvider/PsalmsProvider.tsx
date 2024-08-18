import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { getTonality } from '../../../utils/chordUtils';
import { psalms } from '../../../utils/gql/queries';
import { PsalmsBookItem, PsalmsSortingKeys, Query, QueryPsalmsArgs, SortingDirection } from '../../../utils/gql/types';
import { PsalmsContextType } from '../../types';

import { usePsalmsSelectionData } from './index';

const defaultValue: PsalmsContextType = {
  psalmsQueryDataLoading: false,
  dataLength: 0,
};

export const PsalmsContext = createContext<PsalmsContextType>(defaultValue);

PsalmsContext.displayName = 'PsalmsContext';

export const usePsalms = () => {
  return useContext(PsalmsContext);
};

export const psalmDataMapper = ({ psalm, transpositionSteps }: PsalmsBookItem) => ({
  ...psalm,
  defaultTonality: psalm.defaultTonality,
  tonality: getTonality(psalm.defaultTonality, transpositionSteps),
  transposition: transpositionSteps,
});

const PsalmsProvider = ({ children }: PropsWithChildren) => {
  const { psalmsBookId, favouritePsalmsBookId } = usePsalmsSelectionData();

  const skip = !psalmsBookId || psalmsBookId === favouritePsalmsBookId;

  const { data: psalmsQueryData, loading: psalmsQueryDataLoading } = useQuery<Pick<Query, 'psalms'>, QueryPsalmsArgs>(
    psalms,
    {
      variables: {
        psalmsBookId: psalmsBookId ?? '',
        psalmsSorting: {
          sortingKey: PsalmsSortingKeys.Number,
          sortDirection: SortingDirection.Asc,
        },
      },
      fetchPolicy: 'cache-first',
      skip,
    },
  );

  const psalmsData = useMemo(() => psalmsQueryData?.psalms.map(psalmDataMapper), [psalmsQueryData?.psalms]);

  const dataLength = psalmsData?.length ?? 0;

  return (
    <PsalmsContext.Provider
      value={{
        psalmsData,
        psalmsQueryDataLoading,
        dataLength,
      }}
    >
      {children}
    </PsalmsContext.Provider>
  );
};

export default PsalmsProvider;
