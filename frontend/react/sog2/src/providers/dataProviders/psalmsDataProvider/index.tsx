import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/client';

import { keyToScaleDegree, scaleDegreeToKey } from '../../../components/psalmChords/utils';
import useSelectIntent from '../../../hooks/useSelectIntent';
import { psalm, psalms, psalmsBooks, reorderPsalmsInPsalmsBook, setActivePsalm } from '../../../utils/gql/queries';
import {
  MusicalKey,
  Mutation,
  MutationReorderPsalmsInPsalmsBookArgs,
  MutationSetActivePsalmArgs,
  PsalmsSortingKeys,
  Query,
  QueryPsalmArgs,
  QueryPsalmsArgs,
  Slide,
  SortingDirection,
} from '../../../utils/gql/types';
import { useInstrumentsField } from '../../instrumentsFieldProvider';
import { PsalmsContextType } from '../../types';

import FavouritePsalmsProvider from './FavouriteProvider';

const defaultValue: PsalmsContextType = {
  psalmsBookId: '0',
  psalmId: '0',
  handleUpdateSlide: () => true,
  handleUpdateLocation: () => true,
  handlePrevSlide: () => true,
  handleNextSlide: () => true,
  handlePsalmSelect: () => true,
  handlePsalmBookSelect: () => true,
  handlePsalmsReorder: () => true,
  psalmsQueryDataLoading: false,
  dataLength: 0,
};

export const PsalmsContext = createContext<PsalmsContextType>(defaultValue);

PsalmsContext.displayName = 'PsalmsContext';

export const usePsalmsData = () => {
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

const PsalmsDataProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const psalmsBookId = searchParams.get('psalmsBookId') ?? '';
  const psalmId = searchParams.get('psalmId') ?? '';

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

  const [setActivePsalmMutation] = useMutation<Pick<Mutation, 'setActivePsalm'>, MutationSetActivePsalmArgs>(
    setActivePsalm,
  );

  const [reorderPsalmsInPsalmsBookMutation] = useMutation<
    Pick<Mutation, 'reorderPsalmsInPsalmsBook'>,
    MutationReorderPsalmsInPsalmsBookArgs
  >(reorderPsalmsInPsalmsBook);

  const { data: psalmsBooksData } = useQuery<Pick<Query, 'psalmsBooks'>>(psalmsBooks, {
    fetchPolicy: 'cache-first',
  });

  const favouritePsalmsBookId = useMemo(
    () => psalmsBooksData?.psalmsBooks.find(({ isFavourite }) => isFavourite)?.id,
    [psalmsBooksData],
  );

  const { data: psalmsQueryData, loading: psalmsQueryDataLoading } = useQuery<Pick<Query, 'psalms'>, QueryPsalmsArgs>(
    psalms,
    {
      variables: {
        psalmsBookId: softPsalmsBookIdSelected ?? '',
        psalmsSorting:
          softPsalmsBookIdSelected === favouritePsalmsBookId
            ? undefined
            : {
                sortingKey: PsalmsSortingKeys.Number,
                sortDirection: SortingDirection.Asc,
              },
      },
      fetchPolicy: 'cache-first',
      skip: !softPsalmsBookIdSelected,
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

  const currentPsalmBook = useMemo(
    () => psalmsBooksData?.psalmsBooks.find(({ id }) => softPsalmsBookIdSelected === id),
    [softPsalmsBookIdSelected, psalmsBooksData?.psalmsBooks],
  );

  const psalmsDataLength = psalmsData?.length ?? 0;

  const dataLength = useMemo(() => psalmsDataLength, [psalmsDataLength]);

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

  const { handleUpdateSlide: instrumentsHandleUpdateSlide, currentSlide, silentMode } = useInstrumentsField();

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
            psalmsBookId: softPsalmsBookIdSelected,
            transposition,
          },
        }).catch((e) => console.error(e));
      }
    },
    [setSearchParams, silentMode, setActivePsalmMutation, softPsalmsBookIdSelected],
  );

  const { softSelected: softPsalmIdSelected, setSoftSelected: setSoftPsalmIdSelected } = useSelectIntent({
    hardSelected: psalmId,
    setHardSelected: handlePsalmSelect,
    timeout: 100,
  });

  const { data: currentPsalmData, loading: currentPsalmDataLoading } = useQuery<Pick<Query, 'psalm'>, QueryPsalmArgs>(
    psalm,
    {
      variables: {
        psalmId: softPsalmIdSelected ?? '',
      },
      fetchPolicy: 'cache-first',
      skip: !softPsalmIdSelected,
    },
  );

  useEffect(() => {
    if (!softPsalmIdSelected && psalmsData?.[0]?.id) {
      setSoftPsalmIdSelected(psalmsData[0].id);
    }
  }, [setSoftPsalmIdSelected, softPsalmIdSelected, psalmsData]);

  const currentPsalm = useMemo(
    () => psalmsData?.find(({ id }) => softPsalmIdSelected === id),
    [softPsalmIdSelected, psalmsData],
  );

  useEffect(() => {
    if (softPsalmIdSelected && psalmsData && !currentPsalm) {
      setSearchParams((prev) => {
        prev.delete('psalmId');

        return prev;
      });
    }
  }, [currentPsalm, softPsalmIdSelected, psalmsData, setSearchParams]);

  const getPsalmName = (currentSlide: Slide) =>
    psalmsData?.find(({ id }) => currentSlide?.location?.[1] === id)?.name ?? '';

  const handleUpdateLocation = (newSlide: Slide) => {
    if (!newSlide.location) {
      return;
    }

    const [locationPsalmsBookId, locationPsalmId] = newSlide.location;

    setSoftPsalmsBookIdSelected(locationPsalmsBookId);
    setSoftPsalmIdSelected(locationPsalmId);
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
    if (softPsalmsBookIdSelected) {
      try {
        await reorderPsalmsInPsalmsBookMutation({
          variables: {
            psalmsBookId: softPsalmsBookIdSelected,
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
        psalmsBookId: softPsalmsBookIdSelected ?? '',
        psalmId: softPsalmIdSelected ?? '',
        handleUpdateLocation: () => true,
        handlePrevSlide,
        handleNextSlide,
        handleUpdateSlide,
        handlePsalmsReorder,
        psalmsBooksData: psalmsBooksData?.psalmsBooks,
        psalmsData,
        psalmData: currentPsalmData?.psalm,
        currentPsalm,
        currentPsalmBook,
        handlePsalmSelect: setSoftPsalmIdSelected,
        handlePsalmBookSelect: setSoftPsalmsBookIdSelected,
        psalmsQueryDataLoading,
        dataLength,
      }}
    >
      <FavouritePsalmsProvider favouritePsalmsBookId={favouritePsalmsBookId}>{children}</FavouritePsalmsProvider>
    </PsalmsContext.Provider>
  );
};

export default PsalmsDataProvider;
