import React, { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { sermons } from '../../../utils/gql/queries';
import { Query, QuerySermonsArgs } from '../../../utils/gql/types';
import { SermonsContextType } from '../../types';

const defaultValue: SermonsContextType = {
  sermons: [],
  preparedSermons: [],
  dataLength: 0,
};

export const SermonsContext = createContext<SermonsContextType>(defaultValue);

SermonsContext.displayName = 'SermonsContext';

export const useSermons = () => {
  return useContext(SermonsContext);
};

interface SermonDataProviderProps extends PropsWithChildren {
  sermonsCollectionId?: string;
}

const SermonsProvider: FC<SermonDataProviderProps> = ({ sermonsCollectionId = '0', children }) => {
  const { data } = useQuery<Pick<Query, 'sermons'>, QuerySermonsArgs>(sermons, {
    variables: {
      sermonsCollectionId,
    },
    fetchPolicy: 'cache-first',
  });

  const dataLength = data?.sermons?.length ?? 0;

  const preparedData = useMemo(
    () =>
      data?.sermons?.map(({ id, name, translation, date, audioMapping }) => {
        const sermonDate = new Date(date);

        const year = sermonDate.getFullYear().toString().substr(-2);
        const month = (sermonDate.getMonth() + 1).toString().padStart(2, '0');
        const day = sermonDate.getDate().toString().padStart(2, '0');

        return { id, name: `${year}-${month}${day} ${audioMapping ? '💿 ' : ''}${name} (${translation})` };
      }),
    [data?.sermons],
  );

  return (
    <SermonsContext.Provider
      value={{
        sermons: data?.sermons,
        preparedSermons: preparedData,
        dataLength,
      }}
    >
      {children}
    </SermonsContext.Provider>
  );
};

export default SermonsProvider;
