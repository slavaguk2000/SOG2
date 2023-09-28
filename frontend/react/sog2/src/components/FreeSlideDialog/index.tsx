import React, { Dispatch, forwardRef, ReactElement, Ref, SetStateAction } from 'react';

import { TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface FreeSlideDialogContent {
  text: string;
  title: string;
}

interface FreeSlideDialogProps {
  open: boolean;
  onClose: () => void;
  content?: FreeSlideDialogContent;
  setContent: Dispatch<SetStateAction<FreeSlideDialogContent | undefined>>;
}

const FreeSlideDialog = ({ open, onClose, content, setContent }: FreeSlideDialogProps) => {
  const handleChangeText = (newValue: string) => {
    setContent((prev) => (prev ? { ...prev, text: newValue } : { text: newValue, title: '' }));
  };

  const handleChangeTitle = (newValue: string) =>
    setContent((prev) => (prev ? { ...prev, title: newValue } : { title: newValue, text: '' }));

  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={onClose}>
      <DialogTitle>{'Free Slide'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Content"
          fullWidth
          multiline
          variant="standard"
          value={content?.text ?? ''}
          onChange={({ target: { value } }) => handleChangeText(value)}
          InputProps={{
            onKeyDown: (e) => {
              e.stopPropagation();
            },
          }}
        />
        <TextField
          margin="dense"
          label="Title"
          fullWidth
          variant="standard"
          value={content?.title ?? ''}
          onChange={({ target: { value } }) => handleChangeTitle(value)}
          InputProps={{
            onKeyDown: (e) => {
              e.stopPropagation();
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FreeSlideDialog;
