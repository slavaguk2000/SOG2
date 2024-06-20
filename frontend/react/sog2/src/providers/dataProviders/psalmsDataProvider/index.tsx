import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/client';

import { keyToScaleDegree, scaleDegreeToKey } from '../../../components/psalmChords/utils';
import useSelectIntent from '../../../hooks/useSelectIntent';
import { psalm, psalms, psalmsBooks, setActivePsalm } from '../../../utils/gql/queries';
import {
  MusicalKey,
  Mutation,
  MutationSetActivePsalmArgs,
  Query,
  QueryPsalmArgs,
  QueryPsalmsArgs,
  Slide,
} from '../../../utils/gql/types';
import { useInstrumentsField } from '../../instrumentsFieldProvider';
import { PsalmsContextType } from '../../types';

const defaultValue: PsalmsContextType = {
  psalmsBookId: '0',
  psalmId: '0',
  handleUpdateSlide: () => true,
  handleUpdateLocation: () => true,
  handlePrevSlide: () => true,
  handleNextSlide: () => true,
  handlePsalmSelect: () => true,
  handlePsalmBookSelect: () => true,
  psalmsQueryDataLoading: false,
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
  const [psalmsBookId] = searchParams.get('psalmsBookId') ?? '';
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

  const { data: psalmsBooksData } = useQuery<Pick<Query, 'psalmsBooks'>>(psalmsBooks, {
    fetchPolicy: 'cache-first',
  });

  const favouritePsalmsBook = useMemo(
    () => psalmsBooksData?.psalmsBooks.find(({ isFavourite }) => isFavourite),
    [psalmsBooksData],
  );

  const { data: favouritePsalmsQueryData } = useQuery<Pick<Query, 'psalms'>, QueryPsalmsArgs>(psalms, {
    variables: {
      psalmsBookId: favouritePsalmsBook?.id || '',
    },
    fetchPolicy: 'cache-first',
    skip: !favouritePsalmsBook,
  });

  const { data: psalmsQueryData, loading: psalmsQueryDataLoading } = useQuery<Pick<Query, 'psalms'>, QueryPsalmsArgs>(
    psalms,
    {
      variables: {
        psalmsBookId: softPsalmsBookIdSelected ?? '',
      },
      fetchPolicy: 'cache-first',
      skip: !softPsalmsBookIdSelected,
    },
  );

  const favouritePsalmsQueryDataMap = useMemo(
    () =>
      favouritePsalmsQueryData?.psalms.reduce((acc: Record<string, boolean>, { psalm: { id } }) => {
        acc[id] = true;

        return acc;
      }, {}),
    [favouritePsalmsQueryData?.psalms],
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
        inFavourite: !!favouritePsalmsQueryDataMap?.[psalm.id],
        transposition: transpositionSteps,
      })),
    [favouritePsalmsQueryDataMap, psalmsQueryData?.psalms],
  );

  const handlePsalmSelect = useCallback(
    (id: string, transposition?: number) => {
      setSearchParams((prev) => {
        prev.set('psalmId', id);

        return prev;
      });
      setActivePsalmMutation({
        variables: {
          psalmId: id,
          psalmsBookId: softPsalmsBookIdSelected,
          transposition,
        },
      }).catch((e) => console.error(e));
    },
    [setSearchParams, setActivePsalmMutation, softPsalmsBookIdSelected],
  );

  const currentPsalmBook = useMemo(
    () => psalmsBooksData?.psalmsBooks.find(({ id }) => softPsalmsBookIdSelected === id),
    [softPsalmsBookIdSelected, psalmsBooksData?.psalmsBooks],
  );

  useEffect(() => {
    const potentialValidPsalmsBooks = psalmsBooksData?.psalmsBooks?.filter(({ psalmsCount }) => psalmsCount);

    if (!(softPsalmsBookIdSelected && currentPsalmBook?.psalmsCount) && potentialValidPsalmsBooks?.[0]?.id) {
      setSoftPsalmsBookIdSelected(potentialValidPsalmsBooks[0].id);
    }
  }, [
    currentPsalmBook?.psalmsCount,
    setSoftPsalmsBookIdSelected,
    softPsalmsBookIdSelected,
    psalmsBooksData?.psalmsBooks,
  ]);

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
    if (!psalmId && psalmsData?.[0]?.id) {
      handlePsalmSelect(psalmsData[0].id);
    }
  }, [handlePsalmSelect, psalmId, psalmsData]);

  const currentPsalm = useMemo(() => psalmsData?.find(({ id }) => psalmId === id), [psalmId, psalmsData]);

  useEffect(() => {
    if (psalmId && psalmsData && !currentPsalm) {
      setSearchParams((prev) => {
        prev.delete('psalmId');

        return prev;
      });
    }
  }, [currentPsalm, psalmId, psalmsData, setSearchParams]);

  const { handleUpdateSlide: instrumentsHandleUpdateSlide, currentSlide } = useInstrumentsField();

  const getPsalmName = (currentSlide: Slide) =>
    psalmsData?.find(({ id }) => currentSlide?.location?.[1] === id)?.name ?? '';

  const handleUpdateSlide = (newSlide?: Slide) => {
    if (newSlide) {
      // setLastSlide(newSlide);
      // handleUpdateLocation(newSlide);
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

  return (
    <PsalmsContext.Provider
      value={{
        psalmsBookId: softPsalmsBookIdSelected ?? '',
        psalmId,
        handleUpdateLocation: () => true,
        handlePrevSlide,
        handleNextSlide,
        handleUpdateSlide,
        psalmsBooksData: psalmsBooksData?.psalmsBooks,
        psalmsData,
        psalmData: currentPsalmData?.psalm,
        currentPsalm,
        currentPsalmBook,
        handlePsalmSelect,
        handlePsalmBookSelect: setSoftPsalmsBookIdSelected,
        psalmsQueryDataLoading,
      }}
    >
      {children}
    </PsalmsContext.Provider>
  );
};

export default PsalmsDataProvider;
