import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import usePreviousVersions from '../../../hooks/usePreviousVersions';
import { CoupletContentChord, PsalmData } from '../../../utils/gql/types';
import { keyToScaleDegree } from '../utils';

import implementAddChord from './implementAddChord';
import implementCutToNextLine from './implementCutToNextLine';
import implementEditChord from './implementEditChord';
import implementRemoveChord from './implementRemoveChord';

type ChordsDataContextType = {
  chordsData: PsalmData;
  handleCutToNextLine: (coupletId: string, coupletContentId: string, charPosition: number) => void;
  handleRemoveChord: (coupletId: string, coupletContentId: string) => void;
  handleAddChord: (
    coupletId: string,
    coupletContentId: string,
    charPosition: number,
    chord: CoupletContentChord,
  ) => void;
  handleEditChord: (chord: CoupletContentChord) => void;
  mainKey: number;
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
  handleAddChord: () => true,
  handleEditChord: () => true,
  mainKey: 0,
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

  const { handleAddChord } = implementAddChord({
    setNewChordsData,
    chordsData,
  });

  const { handleEditChord } = implementEditChord({
    setNewChordsData,
    chordsData,
  });

  const mainKey = keyToScaleDegree[chordsData.psalm.defaultTonality as string] ?? 0;

  return (
    <ChordsDataContextTypeContext.Provider
      value={{
        chordsData,
        handleCutToNextLine,
        handleRemoveChord,
        handleAddChord,
        handleEditChord,
        mainKey,
      }}
    >
      {children}
    </ChordsDataContextTypeContext.Provider>
  );
};

export default EditableChordsDataProvider;
