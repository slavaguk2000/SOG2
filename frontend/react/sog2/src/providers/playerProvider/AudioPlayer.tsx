import React, { useCallback, useEffect, useState } from 'react';

import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button, Slider, Tooltip, Typography } from '@mui/material';
import { debounce } from 'lodash';

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
  const [internalValue, setInternalValue] = useState<number | number[] | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = useCallback(
    debounce(
      (value: number | number[]) => {
        seek(value);
      },
      200,
      {
        trailing: true,
        maxWait: 500,
      },
    ),
    [seek],
  );

  useEffect(() => {
    if (internalValue !== null) {
      handleChange(internalValue);
    }
  }, [handleChange, internalValue]);

  const handleSliderChangeCommitted = (event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    setInternalValue(null);
    handleChange(newValue);
  };

  const playerBody = (
    <AudioPlayerWrapper>
      <Button onClick={handlePlayPause}>{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}</Button>
      <Slider
        min={0}
        max={duration}
        value={internalValue ?? played}
        onChange={(e, value) => setInternalValue(value)}
        onChangeCommitted={handleSliderChangeCommitted}
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
