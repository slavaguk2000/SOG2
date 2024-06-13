import React, { useMemo, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';

import { MusicalKey } from '../../../utils/gql/types';
import ChordWheelSelector from '../ChordEditor/ChordWheelSelector';

interface MustProvideDefaultTonalityDialogProps extends DialogProps {
  setNewTonality: (newTonality: MusicalKey) => void;
}

const MustProvideDefaultTonalityDialog = ({ open, setNewTonality }: MustProvideDefaultTonalityDialogProps) => {
  const values = useMemo(
    () =>
      Object.values(MusicalKey).map((key) => ({
        key,
        label: key.replace('Sharp', '#'),
      })),
    [],
  );

  const [currentKey, setCurrentKey] = useState(values[0].key);

  const handleClose = () => {
    setNewTonality(currentKey);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle align="center">{'You must provide default tonality before starting choosing chords'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
        <ChordWheelSelector
          height={50}
          values={values}
          paddings={20}
          onChange={(newValue) => setCurrentKey(newValue as MusicalKey)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MustProvideDefaultTonalityDialog;
