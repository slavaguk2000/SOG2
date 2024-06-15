import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TypeSpecimenIcon from '@mui/icons-material/TypeSpecimen';
import UndoIcon from '@mui/icons-material/Undo';
import { Box, ButtonGroup, Tooltip } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import EditChordIcon from '../../../icons/EditChordIcon';
import { CoupletContentChord } from '../../../utils/gql/types';
import { NewLineIcon, SelectableButton } from '../styled';

import ChordEditorDialog, { ChordDialogState } from './ChordEditorDialog';
import useLowerInstruments, { ChordsEditLowerInstruments } from './useLowerInstruments';

export interface LinkingChordData {
  coupletIdx: number;
  coupletContentIdx: number;
}

type ChordsEditInstrumentsContextType = {
  isCutting: boolean;
  isChordEditing: boolean;
  isChordDeleting: boolean;
  isChordAdding: boolean;
  isChordLinking: boolean;
  isTextEditing: boolean;
  openChordEditorDialog: (
    chordData: CoupletContentChord,
    mainKey: number,
    cb: (newChordData: CoupletContentChord) => void,
    position?: {
      left: number;
      top: number;
    },
  ) => void;
  linkingChordData?: LinkingChordData | null;
  setLinkingChordData: Dispatch<SetStateAction<LinkingChordData | null>>;
  setEditingTextContentId: Dispatch<SetStateAction<string | null>>;
  editingTextContentId: string | null;
};

const defaultValue: ChordsEditInstrumentsContextType = {
  isCutting: false,
  isChordEditing: false,
  isChordDeleting: false,
  isChordAdding: false,
  isChordLinking: false,
  isTextEditing: false,
  openChordEditorDialog: () => true,
  setLinkingChordData: () => true,
  setEditingTextContentId: () => true,
  editingTextContentId: null,
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

export interface UpperInstrument {
  key: ChordsEditInstruments;
  icon: ReactJSXElement;
  tooltip: string;
}

const upperInstruments: Array<UpperInstrument> = [
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

const lowerInstruments = [
  {
    key: ChordsEditLowerInstruments.UNDO,
    icon: <UndoIcon />,
    tooltip: 'Undo',
  },
  {
    key: ChordsEditLowerInstruments.REDO,
    icon: <RedoIcon />,
    tooltip: 'Redo',
  },
  {
    key: ChordsEditLowerInstruments.SAVE,
    icon: <SaveIcon />,
    tooltip: 'Save',
  },
];

const ChordsEditInstrumentsProvider = ({ children }: PropsWithChildren) => {
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const [linkingChordData, setLinkingChordData] = useState<LinkingChordData | null>(null);
  const [editingTextContentId, setEditingTextContentId] = useState<string | null>(null);
  const [chordEditorDialogState, setChordEditorDialogState] = useState<ChordDialogState>({
    open: false,
    chordData: {
      id: uuidv4(),
      chordTemplate: '$m',
      rootNote: 0,
    },
    mainKey: 0,
    cb: () => true,
  });

  const handleUpperInstrumentClick = (key: string) => {
    setLinkingChordData(null);
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
        setLinkingChordData((p) => {
          if (!p) {
            setEditingTextContentId((etp) => {
              if (!etp) {
                setSelectedInstrument(null);
              }

              return null;
            });
          }

          return null;
        });
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenChordEditorDialog = (
    chordData: CoupletContentChord,
    mainKey: number,
    cb: (newChordData: CoupletContentChord) => void,
    position?: {
      left: number;
      top: number;
    },
  ) => {
    setChordEditorDialogState({
      open: true,
      chordData,
      mainKey,
      cb,
      position,
    });
  };

  const { lowerInstrumentsWithHandlers } = useLowerInstruments(lowerInstruments);

  return (
    <ChordsEditInstrumentsContext.Provider
      value={{
        isCutting: selectedInstrument === ChordsEditInstruments.CUT_TO_NEXT_LINE,
        isChordEditing: selectedInstrument === ChordsEditInstruments.EDIT_CHORD,
        isChordDeleting: selectedInstrument === ChordsEditInstruments.REMOVE_CHORD,
        isChordAdding: selectedInstrument === ChordsEditInstruments.ADD_CHORD,
        isChordLinking: selectedInstrument === ChordsEditInstruments.LINK_CHORDS,
        isTextEditing: selectedInstrument === ChordsEditInstruments.EDIT_TEXT,
        openChordEditorDialog: handleOpenChordEditorDialog,
        linkingChordData,
        setLinkingChordData,
        editingTextContentId,
        setEditingTextContentId,
      }}
    >
      <Box display="flex" width="100%">
        <Box width="50px" display="flex" flexDirection="column" justifyContent="space-between">
          <ButtonGroup orientation="vertical" aria-label="Vertical button group" variant="text" fullWidth>
            {upperInstruments.map(({ key, icon, tooltip }) => (
              <Tooltip title={tooltip} key={key} placement="right">
                <SelectableButton selected={selectedInstrument === key} onClick={() => handleUpperInstrumentClick(key)}>
                  {icon}
                </SelectableButton>
              </Tooltip>
            ))}
          </ButtonGroup>

          <ButtonGroup orientation="vertical" aria-label="Vertical button group" variant="text" fullWidth>
            {lowerInstrumentsWithHandlers.map(({ key, icon, tooltip, handler, disabled }) => {
              const button = (
                <SelectableButton key={key} disabled={disabled} onClick={handler}>
                  {icon}
                </SelectableButton>
              );

              return disabled ? (
                button
              ) : (
                <Tooltip title={tooltip} key={key} placement="right">
                  {button}
                </Tooltip>
              );
            })}
          </ButtonGroup>
        </Box>
        {children}
        <ChordEditorDialog state={chordEditorDialogState} setState={setChordEditorDialogState} />
      </Box>
    </ChordsEditInstrumentsContext.Provider>
  );
};

export default ChordsEditInstrumentsProvider;
