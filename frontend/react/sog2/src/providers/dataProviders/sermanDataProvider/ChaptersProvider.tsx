import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import { useQuery } from '@apollo/client';

import { sermon } from '../../../utils/gql/queries';
import { Query, QuerySermonArgs, Slide } from '../../../utils/gql/types';

interface ChaptersProviderContextType {
  sermonId?: string;
  setSermonId?: (id?: string) => void;
  chapters?: Slide[];
  dataLength: number;
}

const defaultValue: ChaptersProviderContextType = {
  dataLength: 0,
};

const ChaptersProviderContext = createContext<ChaptersProviderContextType>(defaultValue);

export const useChapters = () => useContext(ChaptersProviderContext);

const ChaptersProvider = ({ children }: PropsWithChildren) => {
  const [sermonId, setSermonId] = useState<string | undefined>();

  const { data: currentSermonData } = useQuery<Pick<Query, 'sermon'>, QuerySermonArgs>(sermon, {
    variables: {
      sermonId: sermonId ?? '',
    },
    fetchPolicy: 'cache-first',
    skip: !sermonId,
  });

  const dataLength = currentSermonData?.sermon.length ?? 0;

  return (
    <ChaptersProviderContext.Provider
      value={{
        setSermonId,
        sermonId,
        dataLength,
        chapters: currentSermonData?.sermon,
      }}
    >
      {children}
    </ChaptersProviderContext.Provider>
  );
};

export default ChaptersProvider;
