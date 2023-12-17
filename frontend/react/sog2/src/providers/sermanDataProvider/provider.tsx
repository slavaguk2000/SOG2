import React, { FC, PropsWithChildren } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import { sermon } from '../../utils/gql/queries';
import { Query, QuerySermonArgs } from '../../utils/gql/types';

import SermonDataProviderContext from './context';

const SermonDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const { data } = useQuery<Pick<Query, 'sermon'>, QuerySermonArgs>(sermon, {
    variables: {
      sermonId: id ?? 'ce762a0d-113b-466d-9bb9-e975127bb50a',
    },
    fetchPolicy: 'cache-first',
  });

  console.log(data);

  const handleNextSlide = () => {
    return;
  };

  const handlePrevSlide = () => {
    return;
  };

  const handleUpdateSlide = () => {
    return;
  };

  return (
    <SermonDataProviderContext.Provider
      value={{
        handleNextSlide,
        handlePrevSlide,
        handleUpdateSlide,
        currentSermonSlides: data?.sermon,
      }}
    >
      {children}
    </SermonDataProviderContext.Provider>
  );
};

export default SermonDataProvider;
