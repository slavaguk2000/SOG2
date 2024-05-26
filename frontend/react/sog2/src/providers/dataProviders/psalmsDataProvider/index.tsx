import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import { psalm, psalms, psalmsBooks } from '../../../utils/gql/queries';
import { Query, QueryPsalmArgs, QueryPsalmsArgs } from '../../../utils/gql/types';
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

  const { data: psalmsData } = useQuery<Pick<Query, 'psalms'>, QueryPsalmsArgs>(psalms, {
    variables: {
      psalmsBookId,
    },
    fetchPolicy: 'cache-first',
    skip: !psalmsBookId,
  });

  useEffect(() => {
    if (!psalmsBookId && psalmsBooksData?.psalmsBooks[0]?.id) {
      handlePsalmBookSelect(psalmsBooksData.psalmsBooks[0].id);
    }
  }, [handlePsalmBookSelect, psalmsBookId, psalmsBooksData?.psalmsBooks]);

  const { data: currentPsalmData } = useQuery<Pick<Query, 'psalm'>, QueryPsalmArgs>(psalm, {
    variables: {
      psalmId,
    },
    fetchPolicy: 'cache-first',
    skip: !psalmId,
  });

  useEffect(() => {
    if (!psalmId && psalmsData?.psalms?.[0]?.id) {
      handlePsalmSelect(psalmsData.psalms[0].id);
    }
  }, [handlePsalmSelect, psalmId, psalmsData?.psalms]);

  const currentPsalms = useMemo(
    () => psalmsData?.psalms.find(({ id }) => psalmId === id),
    [psalmId, psalmsData?.psalms],
  );

  return (
    <PsalmsContext.Provider
      value={{
        psalmsBookId,
        psalmId,
        handleUpdateSlide: () => true,
        handleUpdateLocation: () => true,
        handlePrevSlide: () => true,
        handleNextSlide: () => true,
        psalmsBooksData: psalmsBooksData?.psalmsBooks,
        psalmsData: psalmsData?.psalms,
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
