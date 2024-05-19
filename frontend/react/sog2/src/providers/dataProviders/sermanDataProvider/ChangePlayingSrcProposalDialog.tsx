import React from 'react';

import { Button, Dialog, DialogActions, DialogProps } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';

interface ChangePlayingSrcProposalDialogProps extends DialogProps {
  sermonTitle?: string;
  handleYes: () => void;
  handleNo: () => void;
}

const ChangePlayingSrcProposalDialog = ({
  open,
  sermonTitle,
  handleYes,
  handleNo,
}: ChangePlayingSrcProposalDialogProps) => {
  return (
    <Dialog open={open} onClose={handleNo}>
      <DialogTitle>{`Хотите начать проигрывание "${sermonTitle}"?`}</DialogTitle>
      <DialogActions>
        <Button onClick={handleNo}>Нет</Button>
        <Button onClick={handleYes} autoFocus>
          Да
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePlayingSrcProposalDialog;
