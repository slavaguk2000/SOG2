import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import usePreviousVersions from '../../../hooks/usePreviousVersions';
import { Couplet, CoupletContentChord, Psalm, PsalmData, Scalars } from '../../../utils/gql/types';
import { keyToScaleDegree } from '../utils';

import implementAddChord from './implementAddChord';
import implementCutToNextLine from './implementCutToNextLine';
import implementEditChord from './implementEditChord';
import implementEditText from './implementEditText';
import implementLinkChords from './implementLinkChords';
import implementRemoveChord from './implementRemoveChord';

type ChordsDataContextType = {
  psalmData?: PsalmData;
  handleCutToNextLine: (coupletId: string, coupletContentId: string, charPosition: number) => void;
  handleRemoveChord: (coupletId: string, coupletContentId: string) => void;
  handleAddChord: (
    coupletId: string,
    coupletContentId: string,
    charPosition: number,
    chord: CoupletContentChord,
  ) => void;
  handleLinkChords: (
    coupletId: string,
    coupletContentId: string,
    charPosition: number,
    chord: CoupletContentChord,
  ) => void;
  handleEditChord: (chord: CoupletContentChord) => void;
  handleEditText: (coupletContentId: string, newText: string) => void;
  mainKey: number;
  hasUndo: boolean;
  hasRedo: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
};

const defaultValue: ChordsDataContextType = {
  handleCutToNextLine: () => true,
  handleRemoveChord: () => true,
  handleAddChord: () => true,
  handleEditChord: () => true,
  handleLinkChords: () => true,
  handleEditText: () => true,
  mainKey: 0,
  hasUndo: false,
  hasRedo: false,
  handleUndo: () => true,
  handleRedo: () => true,
};

export const ChordsDataContextTypeContext = createContext<ChordsDataContextType>(defaultValue);

ChordsDataContextTypeContext.displayName = 'ChordsDataContextTypeContext';

export const useEditableChordsData = () => {
  return useContext(ChordsDataContextTypeContext);
};

interface EditableChordsDataProviderProps extends PropsWithChildren {
  initialData: {
    id: string;
    couplets: Array<Omit<Couplet, '__typename'>>;
    psalm: Psalm;
  };
}

const EditableChordsDataProvider = ({ children, initialData }: EditableChordsDataProviderProps) => {
  const [chordsData, setChordsData] = useState<PsalmData>(initialData);

  const { handleAddNewVersion, hasRedo, hasUndo, handleRedo, handleUndo } = usePreviousVersions(
    initialData,
    setChordsData,
  );

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

  const { handleLinkChords } = implementLinkChords({
    setNewChordsData,
    chordsData,
  });

  const { handleEditText } = implementEditText({
    setNewChordsData,
    chordsData,
  });

  const mainKey = keyToScaleDegree[chordsData.psalm.defaultTonality as string] ?? 0;

  return (
    <ChordsDataContextTypeContext.Provider
      value={{
        psalmData: chordsData,
        handleCutToNextLine,
        handleRemoveChord,
        handleAddChord,
        handleLinkChords,
        handleEditChord,
        handleEditText,
        mainKey,
        hasUndo,
        hasRedo,
        handleUndo,
        handleRedo,
      }}
    >
      {children}
    </ChordsDataContextTypeContext.Provider>
  );
};

export default EditableChordsDataProvider;
