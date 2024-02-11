import React from 'react';

import AlbumIcon from '@mui/icons-material/Album';
import { IconButton, Tooltip } from '@mui/material';

import { usePlayerContext } from '../../providers/playerProvider';

const AudioPlayerButton = () => {
  const { setOpenInterface } = usePlayerContext();

  const handleClick = () => {
    setOpenInterface((prev) => !prev);
  };

  return (
    <Tooltip title={'Audio player'}>
      <IconButton onClick={handleClick}>
        <AlbumIcon />
      </IconButton>
    </Tooltip>
  );
};

export default AudioPlayerButton;
