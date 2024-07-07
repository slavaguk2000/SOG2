import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';

import { useMutation, useQuery } from '@apollo/client';

import { keyToScaleDegree, scaleDegreeToKey } from '../../../components/psalmChords/utils';
import { psalm, psalms, reorderPsalmsInPsalmsBook } from '../../../utils/gql/queries';
import {
  MusicalKey,
  Mutation,
  MutationReorderPsalmsInPsalmsBookArgs,
  PsalmsSortingKeys,
  Query,
  QueryPsalmArgs,
  QueryPsalmsArgs,
  Slide,
  SortingDirection,
} from '../../../utils/gql/types';
import { useInstrumentsField } from '../../instrumentsFieldProvider';
import { PsalmsContextType } from '../../types';

import { usePsalmsSelectionData } from './index';

const defaultValue: PsalmsContextType = {
  handleUpdateSlide: () => true,
  handleUpdateLocation: () => true,
  handlePrevSlide: () => true,
  handleNextSlide: () => true,
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
  const { psalmId, psalmsBookId, handlePsalmSelect, favouritePsalmsBookId, clearPsalmSelect, handlePsalmsBookSelect } =
    usePsalmsSelectionData();

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

  const { handleUpdateSlide: instrumentsHandleUpdateSlide, currentSlide } = useInstrumentsField();

  const { data: currentPsalmData, loading: currentPsalmDataLoading } = useQuery<Pick<Query, 'psalm'>, QueryPsalmArgs>(
    psalm,
    {
      variables: {
        psalmId,
      },
      fetchPolicy: 'cache-first',
      skip: !psalmId,
    },
  );

  useEffect(() => {
    if (!psalmId && psalmsData?.[0]?.id && !isMobile) {
      handlePsalmSelect(psalmsData[0].id);
    }
  }, [psalmId, handlePsalmSelect, psalmsData]);

  const currentPsalm = useMemo(() => psalmsData?.find(({ id }) => psalmId === id), [psalmId, psalmsData]);

  useEffect(() => {
    if (psalmId && psalmsData && !currentPsalm) {
      clearPsalmSelect();
    }
  }, [currentPsalm, psalmId, psalmsData, clearPsalmSelect]);

  const getPsalmName = (currentSlide: Slide) =>
    psalmsData?.find(({ id }) => currentSlide?.location?.[1] === id)?.name ?? '';

  const handleUpdateLocation = (newSlide: Slide) => {
    if (!newSlide.location) {
      return;
    }

    const [locationPsalmsBookId, locationPsalmId] = newSlide.location;

    handlePsalmsBookSelect(locationPsalmsBookId);
    handlePsalmSelect(locationPsalmId);
  };

  const handleUpdateSlide = (newSlide?: Slide) => {
    if (newSlide) {
      // setLastSlide(newSlide);
      handleUpdateLocation(newSlide);
    }

    instrumentsHandleUpdateSlide(
      newSlide && {
        slide: newSlide,
        presentationData: {
          text: getPsalmSlideContentFromSlide(newSlide),
          title: getPsalmName(newSlide),
        },
      },
    );
  };

  const validPsalmData = !currentPsalmDataLoading && currentPsalmData;

  const getCurrentSlideIndex = () =>
    currentSlide && validPsalmData
      ? validPsalmData.psalm.couplets.findIndex(({ id }) => id && currentSlide?.id === id)
      : -1;

  const handleNextSlide = () => {
    if (validPsalmData && currentSlide) {
      const nextVerseIdx = getCurrentSlideIndex() + 1;

      if (nextVerseIdx > 0 && nextVerseIdx < validPsalmData.psalm.couplets.length) {
        handleUpdateSlide(validPsalmData.psalm.couplets[nextVerseIdx].slide);
      }
    }
  };

  const handlePrevSlide = () => {
    if (validPsalmData && currentSlide) {
      const prevVerseIdx = getCurrentSlideIndex() - 1;

      if (prevVerseIdx >= 0) {
        handleUpdateSlide(validPsalmData.psalm.couplets[prevVerseIdx].slide);
      }
    }
  };

  const handlePsalmsReorder = async (ids: string[]) => {
    if (psalmsBookId) {
      try {
        await reorderPsalmsInPsalmsBookMutation({
          variables: {
            psalmsBookId,
            psalmsIds: ids,
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
        handleUpdateLocation: () => true,
        handlePrevSlide,
        handleNextSlide,
        handleUpdateSlide,
        handlePsalmsReorder,
        psalmsData,
        psalmData: currentPsalmData?.psalm,
        currentPsalm,
        psalmsQueryDataLoading,
        dataLength,
      }}
    >
      {children}
    </PsalmsContext.Provider>
  );
};

export default PsalmsProvider;
