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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TypeSpecimenIcon from '@mui/icons-material/TypeSpecimen';
import UndoIcon from '@mui/icons-material/Undo';
import { Box, ButtonGroup, Tooltip } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import EditChordIcon from '../../../icons/EditChordIcon';
import MoveChordIcon from '../../../icons/MoveChordIcon';
import { CoupletContentChord } from '../../../utils/gql/types';
import { GlueWithNextLineIcon, NewLineIcon, SelectableButton } from '../styled';

import ChordEditorDialog, { ChordDialogState } from './ChordEditorDialog';
import useLowerInstruments, { ChordsEditLowerInstruments } from './useLowerInstruments';

export interface LinkingMovingChordData {
  coupletIdx: number;
  coupletContentIdx: number;
}

export interface EditingTextData {
  contentId: string | null;
  number: true | null;
  title: true | null;
}

const defaultEditingTextData: EditingTextData = {
  contentId: null,
  number: null,
  title: null,
};

type ChordsEditInstrumentsContextType = {
  isCutting: boolean;
  isGluing: boolean;
  isChordEditing: boolean;
  isChordDeleting: boolean;
  isChordMoving: boolean;
  isChordAdding: boolean;
  isChordCopying: boolean;
  isChordLinking: boolean;
  isTextEditing: boolean;
  isCoupletHighlighting: boolean;
  openChordEditorDialog: (
    chordData: CoupletContentChord,
    mainKey: number,
    cb: (newChordData: CoupletContentChord) => void,
    position?: {
      left: number;
      top: number;
    },
  ) => void;
  linkingChordData?: LinkingMovingChordData | null;
  setLinkingChordData: Dispatch<SetStateAction<LinkingMovingChordData | null>>;
  movingChordData?: LinkingMovingChordData | null;
  setMovingChordData: Dispatch<SetStateAction<LinkingMovingChordData | null>>;
  copyingChordData?: CoupletContentChord | null;
  setCopyingChordData: Dispatch<SetStateAction<CoupletContentChord | null>>;
  setEditingTextContentId: (contentId: string | null) => void;
  setEditingTextTitleEdit: () => void;
  setEditingTextNumberEdit: () => void;
  clearEditingTextState: () => void;
  editingTextData: EditingTextData;
};

const defaultValue: ChordsEditInstrumentsContextType = {
  isCutting: false,
  isGluing: false,
  isChordEditing: false,
  isChordDeleting: false,
  isChordAdding: false,
  isChordLinking: false,
  isTextEditing: false,
  isChordCopying: false,
  isCoupletHighlighting: false,
  isChordMoving: false,
  openChordEditorDialog: () => true,
  setLinkingChordData: () => true,
  setMovingChordData: () => true,
  setCopyingChordData: () => true,
  setEditingTextContentId: () => true,
  setEditingTextTitleEdit: () => true,
  setEditingTextNumberEdit: () => true,
  clearEditingTextState: () => true,
  editingTextData: defaultEditingTextData,
};

export const ChordsEditInstrumentsContext = createContext<ChordsEditInstrumentsContextType>(defaultValue);

ChordsEditInstrumentsContext.displayName = 'ChordsEditInstrumentsContext';

export const useChordsEditInstrumentsContext = () => {
  return useContext(ChordsEditInstrumentsContext);
};

export enum ChordsEditInstruments {
  CUT_TO_NEXT_LINE = 'cut',
  GLUE_WITH_NEXT_LINE = 'glue',
  EDIT_CHORD = 'editChord',
  MOVE_CHORD = 'moveChord',
  REMOVE_CHORD = 'removeChord',
  ADD_CHORD = 'addChord',
  LINK_CHORDS = 'linkChords',
  EDIT_TEXT = 'editText',
  COPY_CHORD = 'copyChord',
  HIGHLIGHT_COUPLET = 'highlightCouplet',
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
    key: ChordsEditInstruments.GLUE_WITH_NEXT_LINE,
    icon: <GlueWithNextLineIcon />,
    tooltip: 'Glue with next line',
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
    key: ChordsEditInstruments.MOVE_CHORD,
    icon: <MoveChordIcon />,
    tooltip: 'Move chord',
  },
  {
    key: ChordsEditInstruments.ADD_CHORD,
    icon: <TextIncreaseIcon />,
    tooltip: 'Add chord',
  },
  {
    key: ChordsEditInstruments.COPY_CHORD,
    icon: <ContentCopyIcon />,
    tooltip: 'Copy chord',
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
  {
    key: ChordsEditInstruments.HIGHLIGHT_COUPLET,
    icon: <FormatBoldIcon />,
    tooltip: 'Highlight couplet',
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
  const [linkingChordData, setLinkingChordData] = useState<LinkingMovingChordData | null>(null);
  const [movingChordData, setMovingChordData] = useState<LinkingMovingChordData | null>(null);
  const [copyingChordData, setCopyingChordData] = useState<CoupletContentChord | null>(null);
  const [editingTextData, setEditingTextData] = useState<EditingTextData>(defaultEditingTextData);
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

  const clearEditingTextState = () => {
    setEditingTextData(defaultEditingTextData);
  };

  const handleUpperInstrumentClick = (key: string) => {
    setLinkingChordData(null);
    clearEditingTextState();
    setCopyingChordData(null);
    setMovingChordData(null);
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
        setMovingChordData((mp) => {
          if (!mp) {
            setLinkingChordData((lp) => {
              if (!lp) {
                setEditingTextData((etd) => {
                  if (Object.values(etd).every((v) => v === null)) {
                    setCopyingChordData((ccp) => {
                      if (!ccp) {
                        setSelectedInstrument(null);
                      }

                      return null;
                    });
                  }

                  return defaultEditingTextData;
                });
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

  const setEditingTextContentId = (contentId: string | null) => {
    setEditingTextData({
      contentId,
      title: null,
      number: null,
    });
  };

  const setEditingTextTitleEdit = () => {
    setEditingTextData({
      contentId: null,
      title: true,
      number: null,
    });
  };

  const setEditingTextNumberEdit = () => {
    setEditingTextData({
      contentId: null,
      title: null,
      number: true,
    });
  };

  return (
    <ChordsEditInstrumentsContext.Provider
      value={{
        isCutting: selectedInstrument === ChordsEditInstruments.CUT_TO_NEXT_LINE,
        isGluing: selectedInstrument === ChordsEditInstruments.GLUE_WITH_NEXT_LINE,
        isChordEditing: selectedInstrument === ChordsEditInstruments.EDIT_CHORD,
        isChordDeleting: selectedInstrument === ChordsEditInstruments.REMOVE_CHORD,
        isChordMoving: selectedInstrument === ChordsEditInstruments.MOVE_CHORD,
        isChordAdding: selectedInstrument === ChordsEditInstruments.ADD_CHORD,
        isChordLinking: selectedInstrument === ChordsEditInstruments.LINK_CHORDS,
        isTextEditing: selectedInstrument === ChordsEditInstruments.EDIT_TEXT,
        isChordCopying: selectedInstrument === ChordsEditInstruments.COPY_CHORD,
        isCoupletHighlighting: selectedInstrument === ChordsEditInstruments.HIGHLIGHT_COUPLET,
        openChordEditorDialog: handleOpenChordEditorDialog,
        linkingChordData,
        setLinkingChordData,
        movingChordData,
        setMovingChordData,
        editingTextData,
        setEditingTextContentId,
        setEditingTextNumberEdit,
        setEditingTextTitleEdit,
        clearEditingTextState,
        copyingChordData,
        setCopyingChordData,
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
