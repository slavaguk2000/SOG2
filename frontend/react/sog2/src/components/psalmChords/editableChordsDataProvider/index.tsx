import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import usePreviousVersions from '../../../hooks/usePreviousVersions';
import { Couplet, CoupletContentChord, MusicalKey, Psalm, PsalmData } from '../../../utils/gql/types';
import { keyToScaleDegree } from '../utils';

import implementAddChord from './implementAddChord';
import implementCutToNextLine from './implementCutToNextLine';
import implementEditChord from './implementEditChord';
import implementEditText from './implementEditText';
import implementLinkChords from './implementLinkChords';
import implementRemoveChord from './implementRemoveChord';
import implementUnlinkChord from './implementUnlinkChord';
import MustProvideDefaultTonalityDialog from './MustProvideDefaultTonalityDialog';

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
  handleUnlinkChord: (coupletContentId: string) => void;
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
  handleUnlinkChord: () => true,
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
  // TODO : temporary decision to reuse this provider for static chords view
  forceData?: {
    id: string;
    couplets: Array<Omit<Couplet, '__typename'>>;
    psalm: Psalm;
  };
  rootTransposition?: number;
}

const EditableChordsDataProvider = ({
  children,
  initialData,
  forceData,
  rootTransposition = 0,
}: EditableChordsDataProviderProps) => {
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

  const { handleUnlinkChord } = implementUnlinkChord({
    setNewChordsData,
    chordsData,
  });

  const currentData = forceData ?? chordsData;
  const mainKey = (keyToScaleDegree[currentData.psalm.defaultTonality as string] ?? 0) + rootTransposition;

  const handleSetNewTonality = (newTonality: MusicalKey) => {
    setChordsData((p) => ({
      ...p,
      psalm: {
        ...p.psalm,
        defaultTonality: newTonality,
      },
    }));
  };

  return (
    <ChordsDataContextTypeContext.Provider
      value={{
        psalmData: currentData,
        handleCutToNextLine,
        handleRemoveChord,
        handleAddChord,
        handleLinkChords,
        handleEditChord,
        handleEditText,
        handleUnlinkChord,
        mainKey,
        hasUndo,
        hasRedo,
        handleUndo,
        handleRedo,
      }}
    >
      {children}
      <MustProvideDefaultTonalityDialog
        setNewTonality={handleSetNewTonality}
        open={!chordsData.psalm.defaultTonality}
      />
    </ChordsDataContextTypeContext.Provider>
  );
};

export default EditableChordsDataProvider;
