import React from 'react';

import { Box, IconButton, Tooltip } from '@mui/material';

import PlayerIcon from '../../icons/PlayerIcon';
import { usePlayerContext } from '../../providers/playerProvider';

const AudioPlayerButton = () => {
  const { setOpenInterface, duration, played, src } = usePlayerContext();

  const handleClick = () => {
    setOpenInterface((prev) => !prev);
  };

  return (
    <Tooltip title={'Audio player'}>
      <Box>
        <IconButton onClick={handleClick} disabled={!src}>
          <PlayerIcon progress={duration > 0 ? played / duration : 0} />
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default AudioPlayerButton;
