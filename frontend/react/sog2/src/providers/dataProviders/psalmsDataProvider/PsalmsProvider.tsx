import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { keyToScaleDegree, scaleDegreeToKey } from '../../../components/psalmChords/utils';
import { psalms } from '../../../utils/gql/queries';
import {
  MusicalKey,
  PsalmsSortingKeys,
  Query,
  QueryPsalmsArgs,
  Slide,
  SortingDirection,
} from '../../../utils/gql/types';
import { PsalmsContextType } from '../../types';

import useReorderPsalmsMutation from './hooks/useReorderPsalmsMutation';

import { usePsalmsSelectionData } from './index';

const defaultValue: PsalmsContextType = {
  handlePsalmsReorder: () => true,
  psalmsQueryDataLoading: false,
  dataLength: 0,
};

export const PsalmsContext = createContext<PsalmsContextType>(defaultValue);

PsalmsContext.displayName = 'PsalmsContext';

export const usePsalms = () => {
  return useContext(PsalmsContext);
};

export const extractCoupletPrefixFromLocation = (location: string[]) => {
  return location[location.length - 1].trim();
};

export const getPsalmSlideContentFromSlide = (slide?: Slide): string => {
  if (slide) {
    const coupletPrefix = extractCoupletPrefixFromLocation(slide.location ?? []);

    return `${coupletPrefix && `${coupletPrefix} `}${slide.content}`;
  }

  return '';
};

const PsalmsProvider = ({ children }: PropsWithChildren) => {
  const { psalmsBookId, favouritePsalmsBookId } = usePsalmsSelectionData();

  const { data: psalmsQueryData, loading: psalmsQueryDataLoading } = useQuery<Pick<Query, 'psalms'>, QueryPsalmsArgs>(
    psalms,
    {
      variables: {
        psalmsBookId: psalmsBookId ?? '',
        psalmsSorting:
          psalmsBookId === favouritePsalmsBookId
            ? undefined
            : {
                sortingKey: PsalmsSortingKeys.Number,
                sortDirection: SortingDirection.Asc,
              },
      },
      fetchPolicy: 'cache-first',
      skip: !psalmsBookId,
    },
  );

  const psalmsData = useMemo(
    () =>
      psalmsQueryData?.psalms.map(({ psalm, transpositionSteps }) => ({
        ...psalm,
        defaultTonality: psalm.defaultTonality,
        tonality:
          psalm.defaultTonality && transpositionSteps
            ? (scaleDegreeToKey[
                keyToScaleDegree[psalm.defaultTonality.replace('Sharp', '#')] + (transpositionSteps % 12)
              ] as MusicalKey)
            : psalm.defaultTonality,
        transposition: transpositionSteps,
      })),
    [psalmsQueryData?.psalms],
  );

  const dataLength = psalmsData?.length ?? 0;

  const { handlePsalmsReorder } = useReorderPsalmsMutation({ psalmsBookId });

  return (
    <PsalmsContext.Provider
      value={{
        handlePsalmsReorder,
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
