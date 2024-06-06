import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import usePreviousVersions from '../../../hooks/usePreviousVersions';
import { PsalmData } from '../../../utils/gql/types';

import implementCutToNextLine from './implementCutToNextLine';
import implementRemoveChord from './implementRemoveChord';

type ChordsDataContextType = {
  chordsData: PsalmData;
  handleCutToNextLine: (coupletId: string, coupletContentId: string, charPosition: number) => void;
  handleRemoveChord: (coupletId: string, coupletContentId: string) => void;
};

const defaultValue: ChordsDataContextType = {
  chordsData: {
    couplets: [],
    psalm: {
      id: 'unknown',
      name: 'unknown',
    },
  },
  handleCutToNextLine: () => true,
  handleRemoveChord: () => true,
};

export const ChordsDataContextTypeContext = createContext<ChordsDataContextType>(defaultValue);

ChordsDataContextTypeContext.displayName = 'ChordsDataContextTypeContext';

export const useEditableChordsData = () => {
  return useContext(ChordsDataContextTypeContext);
};

interface EditableChordsDataProviderProps extends PropsWithChildren {
  initialData: PsalmData;
}

const EditableChordsDataProvider = ({ children, initialData }: EditableChordsDataProviderProps) => {
  const [chordsData, setChordsData] = useState<PsalmData>(initialData);

  const { handleAddNewVersion } = usePreviousVersions(initialData, setChordsData);

  const setNewChordsData = (newChordsData: PsalmData) => {
    handleAddNewVersion(newChordsData);
    setChordsData(newChordsData);
  };

  const { handleCutToNextLine } = implementCutToNextLine({
    setNewChordsData,
    chordsData,
  });

  const { handleRemoveChord } = implementRemoveChord({
    setNewChordsData,
    chordsData,
  });

  return (
    <ChordsDataContextTypeContext.Provider
      value={{
        chordsData,
        handleCutToNextLine,
        handleRemoveChord,
      }}
    >
      {children}
    </ChordsDataContextTypeContext.Provider>
  );
};

export default EditableChordsDataProvider;
