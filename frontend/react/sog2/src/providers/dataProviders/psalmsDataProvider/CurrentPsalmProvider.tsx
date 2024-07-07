import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useSearchParams } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/client';

import useSelectIntent from '../../../hooks/useSelectIntent';
import { psalm, setActivePsalm } from '../../../utils/gql/queries';
import { Mutation, MutationSetActivePsalmArgs, Query, QueryPsalmArgs, Slide } from '../../../utils/gql/types';
import { useInstrumentsField } from '../../instrumentsFieldProvider';
import { CurrentPsalmContextType } from '../../types';

import { usePsalmsBooksData } from './PsalmsBooksProvider';
import { usePsalms } from './PsalmsProvider';

const defaultValue: CurrentPsalmContextType = {
  handleUpdateSlide: () => true,
  handleUpdateLocation: () => true,
  handlePrevSlide: () => true,
  handleNextSlide: () => true,
  handlePsalmSelect: () => true,
  clearPsalmSelect: () => true,
};

export const CurrentPsalmContext = createContext<CurrentPsalmContextType>(defaultValue);

CurrentPsalmContext.displayName = 'CurrentPsalmContext';

export const useCurrentPsalms = () => {
  return useContext(CurrentPsalmContext);
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

const CurrentPsalmProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { psalmsBookId, handlePsalmsBookSelect } = usePsalmsBooksData();
  const { psalmsData } = usePsalms();
  const psalmId = searchParams.get('psalmId') ?? '';

  const clearPsalmSelect = useCallback(() => {
    setSearchParams((prev) => {
      prev.delete('psalmId');

      return prev;
    });
  }, [setSearchParams]);

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
  });

  const { handleUpdateSlide: instrumentsHandleUpdateSlide, currentSlide } = useInstrumentsField();

  const {
    data: currentPsalmData,
    loading: currentPsalmDataLoading,
    error: currentPsalmDataError,
  } = useQuery<Pick<Query, 'psalm'>, QueryPsalmArgs>(psalm, {
    variables: {
      psalmId: softPsalmIdSelected ?? '',
    },
    fetchPolicy: 'cache-first',
    skip: !softPsalmIdSelected,
  });

  useEffect(() => {
    if (!softPsalmIdSelected && psalmsData?.[0]?.id && !isMobile) {
      setSoftPsalmIdSelected(psalmsData[0].id);
    }
  }, [softPsalmIdSelected, setSoftPsalmIdSelected, psalmsData]);

  const currentPsalm = useMemo(() => psalmsData?.find(({ id }) => psalmId === id), [psalmId, psalmsData]);

  useEffect(() => {
    if (softPsalmIdSelected && psalmsData && currentPsalmDataError) {
      clearPsalmSelect();
    }
  }, [clearPsalmSelect, psalmsData, softPsalmIdSelected, currentPsalmDataError]);

  const getPsalmName = (currentSlide: Slide) =>
    psalmsData?.find(({ id }) => currentSlide?.location?.[1] === id)?.name ?? '';

  const handleUpdateLocation = (newSlide: Slide) => {
    if (!newSlide.location) {
      return;
    }

    const [locationPsalmsBookId, locationPsalmId] = newSlide.location;

    handlePsalmsBookSelect(locationPsalmsBookId);
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

  return (
    <CurrentPsalmContext.Provider
      value={{
        handleUpdateLocation: () => true,
        handlePrevSlide,
        handleNextSlide,
        handleUpdateSlide,
        handlePsalmSelect: setSoftPsalmIdSelected,
        clearPsalmSelect,
        psalmData: currentPsalmData?.psalm,
        currentPsalm,
      }}
    >
      {children}
    </CurrentPsalmContext.Provider>
  );
};

export default CurrentPsalmProvider;
