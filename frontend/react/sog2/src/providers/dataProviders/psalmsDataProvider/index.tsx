import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import { PsalmsDataSelectContextType } from '../../types';

import CurrentPsalmProvider from './CurrentPsalmProvider';
import FavouritePsalmsProvider from './FavouriteProvider';
import PsalmsBooksProvider from './PsalmsBooksProvider';
import PsalmsProvider from './PsalmsProvider';

const defaultValue: PsalmsDataSelectContextType = {
  psalmsBookId: '',
  setFavouritePsalmsBookId: () => true,
};

export const PsalmsDataSelectContext = createContext<PsalmsDataSelectContextType>(defaultValue);

PsalmsDataSelectContext.displayName = 'PsalmsDataSelectContext';

export const usePsalmsSelectionData = () => {
  return useContext(PsalmsDataSelectContext);
};

const PsalmsDataProvider = ({ children }: PropsWithChildren) => {
  const [psalmsBookId, setPsalmsBookId] = useState<string | undefined>();
  const [favouritePsalmsBookId, setFavouritePsalmsBookId] = useState<string | undefined>();

  return (
    <PsalmsDataSelectContext.Provider
      value={{
        psalmsBookId: psalmsBookId ?? '',
        favouritePsalmsBookId,
        setFavouritePsalmsBookId,
      }}
    >
      <PsalmsBooksProvider storedPsalmsBookId={psalmsBookId} onPsalmsBookIdUpdate={setPsalmsBookId}>
        <FavouritePsalmsProvider>
          <PsalmsProvider>
            <CurrentPsalmProvider>{children}</CurrentPsalmProvider>
          </PsalmsProvider>
        </FavouritePsalmsProvider>
      </PsalmsBooksProvider>
    </PsalmsDataSelectContext.Provider>
  );
};

export default PsalmsDataProvider;
