import React, { FC, PropsWithChildren, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import { sermon, sermons } from '../../utils/gql/queries';
import { Query, QuerySermonArgs, QuerySermonsArgs, Slide } from '../../utils/gql/types';

import SermonDataProviderContext from './context';

interface SermonDataProviderProps extends PropsWithChildren {
  sermonsCollectionId?: string;
}

const SermonDataProvider: FC<SermonDataProviderProps> = ({ sermonsCollectionId = '0', children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSermonId = searchParams.get('id') ?? undefined;

  const handleSermonSelect = useCallback(
    (id: string) => {
      setSearchParams((prev) => {
        prev.set('id', id);

        return prev;
      });
    },
    [setSearchParams],
  );

  const { data: sermonsData } = useQuery<Pick<Query, 'sermons'>, QuerySermonsArgs>(sermons, {
    variables: {
      sermonsCollectionId,
    },
    fetchPolicy: 'cache-first',
  });

  const { data: currentSermonData } = useQuery<Pick<Query, 'sermon'>, QuerySermonArgs>(sermon, {
    variables: {
      sermonId: currentSermonId ?? '',
    },
    fetchPolicy: 'cache-first',
    skip: !currentSermonId,
  });

  useEffect(() => {
    if (!currentSermonId && sermonsData) {
      handleSermonSelect(sermonsData.sermons[0].id);
    }
  }, [currentSermonId, handleSermonSelect, sermonsData]);

  const handleNextSlide = () => {
    return;
  };

  const handlePrevSlide = () => {
    return;
  };

  const handleUpdateSlide = (newSlide?: Slide) => {
    console.log('handleUpdateSlide', newSlide);
    const sermonId = newSlide?.location?.[1];

    if (sermonId) {
      setSearchParams((prev) => ({ ...prev, id: sermonId }));
    }

    return;
  };

  const handleUpdateLocation = (newSlide: Slide) => {
    console.log('handleUpdateLocation', newSlide);
  };

  return (
    <SermonDataProviderContext.Provider
      value={{
        handleNextSlide,
        handlePrevSlide,
        handleUpdateSlide,
        handleUpdateLocation,
        handleSermonSelect,
        currentSermonId,
        sermonsData: sermonsData?.sermons,
        currentSermonSlides: currentSermonData?.sermon,
      }}
    >
      {children}
    </SermonDataProviderContext.Provider>
  );
};

export default SermonDataProvider;
