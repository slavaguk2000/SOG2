import React, { FC, PropsWithChildren } from 'react';

import SermonDataProviderContext from './context';

const SermonDataProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SermonDataProviderContext.Provider
      value={{
        a: true,
      }}
    >
      {children}
    </SermonDataProviderContext.Provider>
  );
};

export default SermonDataProvider;
