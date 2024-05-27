import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import { psalm, psalms, psalmsBooks } from '../../../utils/gql/queries';
import { Query, QueryPsalmArgs, QueryPsalmsArgs, Slide } from '../../../utils/gql/types';
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

  const handlePsalmSelect = useCallback(
    (id: string) => {
      setSearchParams((prev) => {
        prev.set('psalmId', id);

        return prev;
      });
    },
    [setSearchParams],
  );

  const { data: psalmsBooksData } = useQuery<Pick<Query, 'psalmsBooks'>>(psalmsBooks, {
    fetchPolicy: 'cache-first',
  });

  const { data: psalmsQueryData } = useQuery<Pick<Query, 'psalms'>, QueryPsalmsArgs>(psalms, {
    variables: {
      psalmsBookId,
    },
    fetchPolicy: 'cache-first',
    skip: !psalmsBookId,
  });

  const psalmsData = psalmsQueryData?.psalms;

  useEffect(() => {
    if (!psalmsBookId && psalmsBooksData?.psalmsBooks[0]?.id) {
      handlePsalmBookSelect(psalmsBooksData.psalmsBooks[0].id);
    }
  }, [handlePsalmBookSelect, psalmsBookId, psalmsBooksData?.psalmsBooks]);

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

  const currentPsalms = useMemo(() => psalmsData?.find(({ id }) => psalmId === id), [psalmId, psalmsData]);

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
    currentSlide && validPsalmData ? validPsalmData.psalm.findIndex(({ id }) => id && currentSlide?.id === id) : -1;

  const handleNextSlide = () => {
    if (validPsalmData && currentSlide) {
      const nextVerseIdx = getCurrentSlideIndex() + 1;

      if (nextVerseIdx > 0 && nextVerseIdx < validPsalmData.psalm.length) {
        handleUpdateSlide(validPsalmData.psalm[nextVerseIdx]);
      }
    }
  };

  const handlePrevSlide = () => {
    if (validPsalmData && currentSlide) {
      const prevVerseIdx = getCurrentSlideIndex() - 1;

      if (prevVerseIdx >= 0) {
        handleUpdateSlide(validPsalmData.psalm[prevVerseIdx]);
      }
    }
  };

  return (
    <PsalmsContext.Provider
      value={{
        psalmsBookId,
        psalmId,
        handleUpdateLocation: () => true,
        handlePrevSlide,
        handleNextSlide,
        handleUpdateSlide,
        psalmsBooksData: psalmsBooksData?.psalmsBooks,
        psalmsData,
        psalmSlides: currentPsalmData?.psalm,
        currentPsalms,
        handlePsalmSelect,
      }}
    >
      {children}
    </PsalmsContext.Provider>
  );
};

export default PsalmsDataProvider;
