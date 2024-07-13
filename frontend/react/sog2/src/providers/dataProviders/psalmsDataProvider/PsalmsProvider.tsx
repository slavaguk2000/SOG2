import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { useMutation, useQuery } from '@apollo/client';

import { keyToScaleDegree, scaleDegreeToKey } from '../../../components/psalmChords/utils';
import { arrayToMap } from '../../../utils';
import { psalms, reorderPsalmsInPsalmsBook } from '../../../utils/gql/queries';
import {
  MusicalKey,
  Mutation,
  MutationReorderPsalmsInPsalmsBookArgs,
  PsalmsBookItem,
  PsalmsSortingKeys,
  Query,
  QueryPsalmsArgs,
  Slide,
  SortingDirection,
} from '../../../utils/gql/types';
import { PsalmsContextType } from '../../types';

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

  const [reorderPsalmsInPsalmsBookMutation] = useMutation<
    Pick<Mutation, 'reorderPsalmsInPsalmsBook'>,
    MutationReorderPsalmsInPsalmsBookArgs
  >(reorderPsalmsInPsalmsBook);

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

  const handlePsalmsReorder = async (ids: string[]) => {
    if (psalmsBookId) {
      try {
        await reorderPsalmsInPsalmsBookMutation({
          variables: {
            psalmsBookId,
            psalmsIds: ids,
          },
          update: (cache) => {
            const data = cache.readQuery<Pick<Query, 'psalms'>, QueryPsalmsArgs>({
              query: psalms,
              variables: { psalmsBookId },
            });

            if (data) {
              const psalmMap = arrayToMap(data.psalms, { keyMapper: ({ psalm }) => psalm.id });

              const reorderedPsalms = ids.reduce((acc: Array<PsalmsBookItem>, id) => {
                const psalm = psalmMap[id];
                if (psalm) {
                  acc.push(psalm);
                }

                return acc;
              }, []);

              cache.writeQuery({
                query: psalms,
                variables: { psalmsBookId },
                data: {
                  psalms: reorderedPsalms,
                },
              });
            }
          },
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

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
