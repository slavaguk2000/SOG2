import React, { Dispatch, SetStateAction, useMemo } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import { Box, Button, IconButton, TextField } from '@mui/material';

import { CoupletContentChord } from '../../../utils/gql/types';
import { keyToScaleDegree } from '../../psalmChordsView/utils';
import ChordEditor, { getIdxByScaleDegree } from '../ChordEditor/ChordEditor';

import { DialogContentWrapper, StyledDialog } from './styled';

export interface ChordDialogState {
  open: boolean;
  chordData: CoupletContentChord;
  mainKey: number;
  cb: (newChordData: CoupletContentChord) => void;
}
interface ChordEditorDialogProps {
  state: ChordDialogState;
  setState: Dispatch<SetStateAction<ChordDialogState>>;
}

const ChordEditorDialog = ({ state, setState }: ChordEditorDialogProps) => {
  const handleCloseChordEditorDialog = () => {
    setState((p) => ({
      ...p,
      open: false,
    }));
  };

  const { chordTemplate } = state.chordData;

  const [prevValue, postValue] = useMemo(() => chordTemplate.split('$', 2), [chordTemplate]);

  const handleChangeTemplate = (key: 'prevValue' | 'postValue', target: { value: string }) => {
    setState((p) => {
      const [prevValue, postValue] = p.chordData.chordTemplate.split('$', 2);

      const values = {
        prevValue,
        postValue,
        [key]: target.value,
      };

      return {
        ...p,
        chordData: {
          ...p.chordData,
          chordTemplate: `${values.prevValue}$${values.postValue}`,
        },
      };
    });
  };

  const handleChangeChord = (key: 'rootNote' | 'bassNote', value: string) => {
    let currentNote: null | number = null;
    if (value) {
      currentNote = (12 + keyToScaleDegree[value.slice(0, 2)] - state.mainKey) % 12;
    }

    setState((p) => ({
      ...p,
      chordData: {
        ...p.chordData,
        [key]: currentNote,
      },
    }));
  };

  const handleSubmit = () => {
    state.cb(state.chordData);
    handleCloseChordEditorDialog();
  };

  return (
    <StyledDialog open={state.open} onClose={handleCloseChordEditorDialog}>
      <DialogContentWrapper>
        <TextField
          inputProps={{
            sx: { textAlign: 'end' },
          }}
          variant="standard"
          value={prevValue}
          onChange={({ target }) => handleChangeTemplate('prevValue', target)}
        />
        <ChordEditor
          fontSize={28}
          onChange={(value) => handleChangeChord('rootNote', value)}
          initIdx={getIdxByScaleDegree(state.mainKey + state.chordData.rootNote)}
        />
        <TextField
          variant="standard"
          value={postValue}
          onChange={({ target }) => handleChangeTemplate('postValue', target)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleChangeTemplate('postValue', { value: '' })}>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
        <Box height="min-content">/</Box>
        <ChordEditor fontSize={28} withEmpty onChange={(value) => handleChangeChord('bassNote', value)} />
        <Button onClick={handleSubmit}>
          <DoneIcon />
        </Button>
      </DialogContentWrapper>
    </StyledDialog>
  );
};

export default ChordEditorDialog;
