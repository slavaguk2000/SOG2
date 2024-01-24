import React, { useEffect, useRef, useState } from 'react';

import AlbumIcon from '@mui/icons-material/Album';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, Slider, Typography } from '@mui/material';

import { useSermonData } from '../../providers/sermanDataProvider';

import InstrumentWithPopper from './InstrumentWithPopper';
import { AudioPlayerWrapper } from './styled';

const formatTime = (seconds: number | typeof NaN) => {
  if (isNaN(seconds)) {
    seconds = 0;
  }

  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audio = audioRef?.current;

  useEffect(() => {
    if (!audio) {
      return;
    }

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioData);

    setAudioData();

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioData);
    };
  }, [audio]);

  const togglePlayPause = async () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      return audioRef?.current?.play();
    } else {
      return audioRef?.current?.pause();
    }
  };

  const handleSliderChange = (event: Event, newValue: number) => {
    if (!audioRef?.current) {
      return;
    }

    audioRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const { currentSermon } = useSermonData();

  const audioSrc = currentSermon?.audioLink ? `https://branham.ru${currentSermon.audioLink}` : undefined;

  return (
    <Box>
      <audio ref={audioRef} src={audioSrc} preload="metadata">
        <track kind="captions" />
      </audio>
      <InstrumentWithPopper
        icon={<AlbumIcon />}
        tooltip="Audio player"
        disabled={!audioSrc}
        popoverSx={{ opacity: 0.7 }}
      >
        {audioSrc && (
          <AudioPlayerWrapper>
            <Button onClick={togglePlayPause}>{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}</Button>
            <Slider
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e, newValue) => handleSliderChange(e, typeof newValue === 'number' ? newValue : newValue[0])}
              valueLabelDisplay="off"
              valueLabelFormat={formatTime}
            />
            <Typography>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          </AudioPlayerWrapper>
        )}
      </InstrumentWithPopper>
    </Box>
  );
};

export default AudioPlayer;
