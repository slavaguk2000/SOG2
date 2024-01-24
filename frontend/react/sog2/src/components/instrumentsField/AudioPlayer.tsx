import React, { useState } from 'react';
import ReactPlayer from 'react-player';

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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [played, setPlayed] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const playerRef = React.createRef<ReactPlayer>();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    setPlayed(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (value: number | number[]) => {
    if (typeof value === 'number') {
      setPlayed(value);
      playerRef?.current?.seekTo?.(value);
    }
  };

  const { currentSermon } = useSermonData();

  const audioSrc = currentSermon?.audioLink ? `https://branham.ru${currentSermon.audioLink}` : undefined;

  return (
    <Box>
      <ReactPlayer
        url={audioSrc}
        playing={isPlaying}
        onProgress={handleProgress}
        onDuration={handleDuration}
        height="0"
        width="0"
        ref={playerRef}
      />
      <InstrumentWithPopper
        icon={<AlbumIcon />}
        tooltip="Audio player"
        disabled={!audioSrc}
        popoverSx={{ opacity: 0.7 }}
      >
        {audioSrc && (
          <AudioPlayerWrapper>
            <Button onClick={handlePlayPause}>{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}</Button>
            <Slider
              min={0}
              max={duration}
              value={played}
              onChange={(e, value) => handleSeek(value)}
              valueLabelDisplay="off"
              valueLabelFormat={formatTime}
            />
            <Typography>
              {formatTime(played)} / {formatTime(duration)}
            </Typography>
          </AudioPlayerWrapper>
        )}
      </InstrumentWithPopper>
    </Box>
  );
};

export default AudioPlayer;
