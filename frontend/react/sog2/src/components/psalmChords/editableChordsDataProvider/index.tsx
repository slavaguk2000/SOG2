import React, { createContext, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import usePreviousVersions from '../../../hooks/usePreviousVersions';
import { Couplet, CoupletContentChord, MusicalKey, Psalm, PsalmData } from '../../../utils/gql/types';
import { keyToScaleDegree } from '../utils';

import implementAddChord from './implementAddChord';
import implementCoupletHighlighting from './implementCoupletHighlighting';
import implementCutToNextLine from './implementCutToNextLine';
import implementEditChord from './implementEditChord';
import implementEditText from './implementEditText';
import implementGlueWithNextLine from './implementGlueWithNextLine';
import implementLinkChords from './implementLinkChords';
import implementMoveChord from './implementMoveChord';
import implementRemoveChord from './implementRemoveChord';
import implementUnlinkChord from './implementUnlinkChord';
import MustProvideDefaultTonalityDialog from './MustProvideDefaultTonalityDialog';

type ChordsDataContextType = {
  psalmData?: PsalmData;
  handleCutToNextLine: (coupletId: string, coupletContentId: string, charPosition: number) => void;
  handleGlueWithNextLine: (coupletId: string, lineNumber: number) => void;
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
  handleEditTitle: (newTitle: string) => void;
  handleEditNumber: (newNumber: string) => void;
  handleUnlinkChord: (coupletContentId: string) => void;
  handleMoveChord: (coupletIdx: number, coupletContentIdx: number, isLeft: boolean) => void;
  mainKey: number;
  hasUndo: boolean;
  hasRedo: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  toggleCoupletHighlighting: (coupletId: string) => void;
  addCouplet: () => void;
  removeCouplet: (coupletId: string) => void;
  clearLocalStorage: () => void;
};

const defaultValue: ChordsDataContextType = {
  handleCutToNextLine: () => true,
  handleGlueWithNextLine: () => true,
  handleRemoveChord: () => true,
  handleAddChord: () => true,
  handleEditChord: () => true,
  handleLinkChords: () => true,
  handleEditText: () => true,
  handleEditTitle: () => true,
  handleEditNumber: () => true,
  handleUnlinkChord: () => true,
  handleMoveChord: () => true,
  mainKey: 0,
  hasUndo: false,
  hasRedo: false,
  handleUndo: () => true,
  handleRedo: () => true,
  toggleCoupletHighlighting: () => true,
  addCouplet: () => true,
  removeCouplet: () => true,
  clearLocalStorage: () => true,
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

  const { handleAddNewVersion, hasRedo, hasUndo, handleRedo, handleUndo, clearLocalStorage } = usePreviousVersions(
    initialData,
    setChordsData,
    `chordsEdit.${initialData.psalm?.id}`,
  );

  const setNewChordsData = (newChordsData: SetStateAction<PsalmData>) => {
    if (typeof newChordsData === 'function') {
      setChordsData((p) => {
        const newValue = newChordsData(p);
        handleAddNewVersion(newValue);
        return newValue;
      });
    } else {
      handleAddNewVersion(newChordsData);
      setChordsData(newChordsData);
    }
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

  const { toggleCoupletHighlighting } = implementCoupletHighlighting({
    setNewChordsData,
  });

  const { handleGlueWithNextLine } = implementGlueWithNextLine({
    setNewChordsData,
    chordsData,
  });

  const { handleMoveChord } = implementMoveChord({
    setNewChordsData,
    chordsData,
  });

  const currentData = forceData ?? chordsData;
  const mainKey =
    ((currentData.psalm && keyToScaleDegree[currentData.psalm.defaultTonality as string]) ?? 0) + rootTransposition;

  const handleSetNewTonality = (newTonality: MusicalKey) => {
    setNewChordsData((p) => ({
      ...p,
      psalm: {
        ...p.psalm,
        defaultTonality: newTonality,
      },
    }));
  };

  const handleEditTitle = (newTitle: string) => {
    if (newTitle.length) {
      setNewChordsData((p) => ({
        ...p,
        psalm: {
          ...p.psalm,
          name: newTitle,
        },
      }));
    }
  };

  const handleEditNumber = (newNumber: string) => {
    if (newNumber.length) {
      setNewChordsData((p) => ({
        ...p,
        psalm: {
          ...p.psalm,
          psalmNumber: newNumber,
        },
      }));
    }
  };

  const addCouplet = (text?: string) => {
    setNewChordsData((p) => ({
      ...p,
      couplets: [
        ...p.couplets,
        {
          id: uuidv4(),
          coupletContent: [
            {
              id: uuidv4(),
              chord: {
                id: uuidv4(),
                chordTemplate: '$',
                rootNote: 0,
              },
              line: 0,
              text: text ?? 'New couplet',
            },
          ],
          initialOrder: p.couplets.length,
          marker: '',
          styling: 0,
        },
      ],
    }));
  };

  const removeCouplet = (coupletId: string) => {
    setNewChordsData((p) => ({
      ...p,
      couplets: p.couplets.filter(({ id }) => id !== coupletId),
    }));
  };

  return (
    <ChordsDataContextTypeContext.Provider
      value={{
        psalmData: currentData,
        handleMoveChord,
        handleCutToNextLine,
        handleGlueWithNextLine,
        handleRemoveChord,
        handleAddChord,
        handleLinkChords,
        handleEditChord,
        handleEditText,
        handleUnlinkChord,
        handleEditNumber,
        handleEditTitle,
        toggleCoupletHighlighting,
        addCouplet,
        removeCouplet,
        mainKey,
        hasUndo,
        hasRedo,
        handleUndo,
        handleRedo,
        clearLocalStorage,
      }}
    >
      {children}
      <MustProvideDefaultTonalityDialog
        setNewTonality={handleSetNewTonality}
        open={!(chordsData.psalm?.defaultTonality || forceData)}
      />
    </ChordsDataContextTypeContext.Provider>
  );
};

export default EditableChordsDataProvider;
