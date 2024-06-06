import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import EditNoteIcon from '@mui/icons-material/EditNote';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TypeSpecimenIcon from '@mui/icons-material/TypeSpecimen';
import { Box, ButtonGroup, Tooltip } from '@mui/material';

import EditChordIcon from '../../../icons/EditChordIcon';
import { NewLineIcon, SelectableButton } from '../styled';

type ChordsEditInstrumentsContextType = {
  isCutting: boolean;
  isChordEditing: boolean;
  isChordDeleting: boolean;
  isChordAdding: boolean;
  isChordLinking: boolean;
  isTextEditing: boolean;
};

const defaultValue: ChordsEditInstrumentsContextType = {
  isCutting: false,
  isChordEditing: false,
  isChordDeleting: false,
  isChordAdding: false,
  isChordLinking: false,
  isTextEditing: false,
};

export const ChordsEditInstrumentsContext = createContext<ChordsEditInstrumentsContextType>(defaultValue);

ChordsEditInstrumentsContext.displayName = 'ChordsEditInstrumentsContext';

export const useChordsEditInstrumentsContext = () => {
  return useContext(ChordsEditInstrumentsContext);
};

export enum ChordsEditInstruments {
  CUT_TO_NEXT_LINE = 'cut',
  EDIT_CHORD = 'editChord',
  REMOVE_CHORD = 'removeChord',
  ADD_CHORD = 'addChord',
  LINK_CHORDS = 'linkChords',
  EDIT_TEXT = 'editText',
}

const ChordsEditInstrumentsProvider = ({ children }: PropsWithChildren) => {
  // instruments
  const instruments = [
    {
      key: ChordsEditInstruments.CUT_TO_NEXT_LINE,
      icon: <NewLineIcon />,
      tooltip: 'Cut line',
    },
    {
      key: ChordsEditInstruments.REMOVE_CHORD,
      icon: <TextDecreaseIcon />,
      tooltip: 'Remove chord',
    },
    {
      key: ChordsEditInstruments.EDIT_CHORD,
      icon: <EditChordIcon />,
      tooltip: 'Edit chord',
    },
    {
      key: ChordsEditInstruments.ADD_CHORD,
      icon: <TextIncreaseIcon />,
      tooltip: 'Add chord',
    },
    {
      key: ChordsEditInstruments.LINK_CHORDS,
      icon: <TypeSpecimenIcon />,
      tooltip: 'Link chords',
    },
    {
      key: ChordsEditInstruments.EDIT_TEXT,
      icon: <EditNoteIcon />,
      tooltip: 'Edit text',
    },
  ];
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);

  const handleInstrumentClick = (key: string) => {
    setSelectedInstrument((p) => {
      if (key === p) {
        return null;
      }

      return key;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        event.preventDefault();
        setSelectedInstrument(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ChordsEditInstrumentsContext.Provider
      value={{
        isCutting: selectedInstrument === ChordsEditInstruments.CUT_TO_NEXT_LINE,
        isChordEditing: selectedInstrument === ChordsEditInstruments.EDIT_CHORD,
        isChordDeleting: selectedInstrument === ChordsEditInstruments.REMOVE_CHORD,
        isChordAdding: selectedInstrument === ChordsEditInstruments.ADD_CHORD,
        isChordLinking: selectedInstrument === ChordsEditInstruments.LINK_CHORDS,
        isTextEditing: selectedInstrument === ChordsEditInstruments.EDIT_TEXT,
      }}
    >
      <Box display="flex" width="100%">
        <Box width="50px">
          <ButtonGroup orientation="vertical" aria-label="Vertical button group" variant="text" fullWidth>
            {instruments.map(({ key, icon, tooltip }) => (
              <Tooltip title={tooltip} key={key} placement="right">
                <SelectableButton selected={selectedInstrument === key} onClick={() => handleInstrumentClick(key)}>
                  {icon}
                </SelectableButton>
              </Tooltip>
            ))}
          </ButtonGroup>
        </Box>
        {children}
      </Box>
    </ChordsEditInstrumentsContext.Provider>
  );
};

export default ChordsEditInstrumentsProvider;
