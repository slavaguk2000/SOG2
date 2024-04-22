import React, { FC, PropsWithChildren, useState } from 'react';

import MainScreenRatioProviderContext from './context';

const MainScreenRatioProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ratio, setRatio] = useState(4 / 3);

  const proposeNewRatio = (newRatio: number) => {
    setRatio(newRatio);
    console.log(`New ratio: ${newRatio}`);
  };

  return (
    <MainScreenRatioProviderContext.Provider
      value={{
        proposeNewRatio,
        ratio,
      }}
    >
      {children}
    </MainScreenRatioProviderContext.Provider>
  );
};

export default MainScreenRatioProvider;
