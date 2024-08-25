import React, { useState } from 'react';

import { Dialog, DialogProps, DialogTitle, TextField, DialogActions, Button, DialogContent } from '@mui/material';

import { allPossibleTonalities } from '../../../utils/chordUtils';
import { MusicalKey } from '../../../utils/gql/types';
import ChordWheelSelector from '../../psalmChords/ChordEditor/ChordWheelSelector';

interface AddPsalmDialogProps extends DialogProps {
  psalmBookId?: string;
  onClose: () => void;
}

const AddPsalmDialog = ({ psalmBookId, ...rest }: AddPsalmDialogProps) => {
  const [title, setTitle] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [tonality, setTonality] = useState<MusicalKey>(allPossibleTonalities[0].key as MusicalKey);

  const disabled = !(title && number);

  const onAdd = () => {
    if (disabled) {
      return;
    }

    console.log(JSON.stringify({ number, title, tonality }));
  };

  return (
    <Dialog {...rest}>
      <DialogTitle>Add psalm</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
        <TextField
          sx={{ width: '100px' }}
          onKeyDown={(e) => e.stopPropagation()}
          color="primary"
          autoFocus
          required
          margin="dense"
          name="number"
          label="Psalm number"
          variant="standard"
          value={number}
          onChange={({ target }) => setNumber(target.value)}
        />
        <TextField
          onKeyDown={(e) => e.stopPropagation()}
          color="primary"
          required
          margin="dense"
          name="title"
          label="Psalm title"
          variant="standard"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <ChordWheelSelector
          height={20}
          values={allPossibleTonalities}
          paddings={5}
          initIdx={0}
          onChange={(newTonality) => setTonality(newTonality as MusicalKey)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={rest.onClose}>Cancel</Button>
        <Button disabled={disabled} onClick={onAdd}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPsalmDialog;
