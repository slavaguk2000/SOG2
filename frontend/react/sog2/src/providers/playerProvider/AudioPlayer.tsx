import React from 'react';

import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button, Slider, Tooltip, Typography } from '@mui/material';

import { AudioPlayerWrapper } from '../../components/instrumentsField/styled';

import { usePlayerContext } from './index';

const formatTime = (seconds: number | typeof NaN) => {
  if (isNaN(seconds)) {
    seconds = 0;
  }

  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};

const AudioPlayer = () => {
  const { duration, played, title, isPlaying, handlePlayPause, seek } = usePlayerContext();

  const playerBody = (
    <AudioPlayerWrapper>
      <Button onClick={handlePlayPause}>{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}</Button>
      <Slider
        min={0}
        max={duration}
        value={played}
        onChange={(e, value) => seek(value)}
        valueLabelDisplay="off"
        valueLabelFormat={formatTime}
      />
      <Typography>
        {formatTime(played)} / {formatTime(duration)}
      </Typography>
    </AudioPlayerWrapper>
  );

  return title ? <Tooltip title={title}>{playerBody}</Tooltip> : playerBody;
};

export default AudioPlayer;
