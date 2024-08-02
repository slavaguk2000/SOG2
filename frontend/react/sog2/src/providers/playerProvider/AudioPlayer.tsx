import React, { useCallback, useEffect, useState } from 'react';

import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button, Slider, Tooltip, Typography } from '@mui/material';
import { debounce } from 'lodash';

import { AudioPlayerWrapper } from '../../components/instrumentsField/styled';
import { formatTime } from '../../utils';
import AudioMappingController from '../AudioMapping/controller';

import { usePlayerContext } from './index';

const AudioPlayer = () => {
  const { duration, played, title, isPlaying, handlePlayPause, seek } = usePlayerContext();
  const [internalValue, setInternalValue] = useState<number | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = useCallback(
    debounce(
      (value: number) => {
        seek(value);
      },
      1000,
      {
        trailing: true,
        maxWait: 5000,
      },
    ),
    [seek, setInternalValue],
  );

  useEffect(() => {
    if (internalValue !== null) {
      handleChange(internalValue);

      if (Math.ceil(internalValue) === Math.floor(played)) {
        setInternalValue(null);
      }
    }
  }, [handleChange, internalValue, played]);

  const internalPlayed = internalValue ?? played;

  const handleSliderChangeCommitted = (event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      handleChange(newValue);
    }
  };

  const handleSliderWheel = (e: React.WheelEvent<HTMLSpanElement>) => {
    if (duration) {
      const newValue = Math.max(Math.min(internalPlayed + e.deltaY / 10 - e.deltaX / 10, duration), 0);
      setInternalValue(newValue);
    }
  };

  const playerBody = (
    <AudioPlayerWrapper>
      <Button onClick={handlePlayPause}>{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}</Button>
      <Slider
        onWheel={handleSliderWheel}
        min={0}
        max={duration}
        value={internalPlayed}
        onChange={(e, value) => setInternalValue(typeof value === 'number' ? value : value[0])}
        onChangeCommitted={handleSliderChangeCommitted}
        valueLabelDisplay="off"
        valueLabelFormat={formatTime}
      />
      <Typography>
        {formatTime(internalPlayed)} / {formatTime(duration)}
      </Typography>
      <AudioMappingController />
    </AudioPlayerWrapper>
  );

  return title ? <Tooltip title={title}>{playerBody}</Tooltip> : playerBody;
};

export default AudioPlayer;
