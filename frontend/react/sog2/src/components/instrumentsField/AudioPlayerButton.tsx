import React from 'react';

import { IconButton, Tooltip } from '@mui/material';

import PlayerIcon from '../../icons/PlayerIcon';
import { usePlayerContext } from '../../providers/playerProvider';

const AudioPlayerButton = () => {
  const { setOpenInterface, duration, played } = usePlayerContext();

  const handleClick = () => {
    setOpenInterface((prev) => !prev);
  };

  return (
    <Tooltip title={'Audio player'}>
      <IconButton onClick={handleClick}>
        <PlayerIcon progress={duration > 0 ? played / duration : 0} />
      </IconButton>
    </Tooltip>
  );
};

export default AudioPlayerButton;
