import React from 'react';

import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { IconButton } from '@mui/material';

import { useFreeSlideDialog } from 'src/providers/FreeSlideDialogProvider';

const FreeSlideDialogButton = () => {
  const { setOpen } = useFreeSlideDialog();

  return (
    <IconButton onClick={() => setOpen(true)}>
      <AddToQueueIcon />
    </IconButton>
  );
};

export default FreeSlideDialogButton;
