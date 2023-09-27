import React from 'react';

import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { IconButton, Tooltip } from '@mui/material';

import { useFreeSlideDialog } from 'src/providers/FreeSlideDialogProvider';

const FreeSlideDialogButton = () => {
  const { setOpen } = useFreeSlideDialog();

  return (
    <Tooltip title="Free slide">
      <IconButton onClick={() => setOpen(true)}>
        <AddToQueueIcon />
      </IconButton>
    </Tooltip>
  );
};

export default FreeSlideDialogButton;
