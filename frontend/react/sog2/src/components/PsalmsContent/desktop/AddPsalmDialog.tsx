import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogProps,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { allPossibleTonalities } from '../../../utils/chordUtils';
import { addPsalm } from '../../../utils/gql/queries';
import { MusicalKey, Mutation, MutationAddPsalmArgs } from '../../../utils/gql/types';
import ChordWheelSelector from '../../psalmChords/ChordEditor/ChordWheelSelector';

import { openChordEditor } from './utils';

interface AddPsalmDialogProps extends DialogProps {
  psalmsBookId?: string;
  onClose: () => void;
}

const AddPsalmDialog = ({ psalmsBookId, ...rest }: AddPsalmDialogProps) => {
  const [title, setTitle] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [tonality, setTonality] = useState<MusicalKey>(allPossibleTonalities[0].key as MusicalKey);

  const [addPsalmMutation, { loading }] = useMutation<Pick<Mutation, 'addPsalm'>, MutationAddPsalmArgs>(addPsalm);

  const disabled = !(title && number);

  const onAdd = async () => {
    if (disabled || !psalmsBookId) {
      return;
    }

    const { data } = await addPsalmMutation({
      variables: {
        psalmName: title,
        psalmNumber: number,
        psalmsBookId,
        tonality,
      },
      refetchQueries: ['psalmsBooks', 'psalms'],
    });

    if (data?.addPsalm) {
      openChordEditor(data?.addPsalm);
      setTitle('');
      setNumber('');
      rest?.onClose();
    }
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
        <Button disabled={disabled || loading} onClick={onAdd}>
          {loading ? <CircularProgress size={20} /> : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPsalmDialog;
