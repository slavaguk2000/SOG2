import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import ReactPlayer from 'react-player';

import { PlayerContextType } from '../types';

const defaultValue: PlayerContextType = {
  setAudio: () => true,
  seek: () => true,
  handlePlayPause: () => true,
  setOpenInterface: () => true,
  src: '',
  title: '',
  played: 0,
  duration: 0,
  isPlaying: false,
  openInterface: false,
};

const PlayerContext = createContext<PlayerContextType>(defaultValue);

PlayerContext.displayName = 'PlayerContext';

export const usePlayerContext = () => {
  return useContext(PlayerContext);
};

const PlayerContextProvider = ({ children }: PropsWithChildren) => {
  const [openInterface, setOpenInterface] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [played, setPlayed] = useState<number>(0);
  const [mustPlayed, setMustPlayed] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const playerRef = React.createRef<ReactPlayer>();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (value: number | number[]) => {
    if (typeof value === 'number') {
      setMustPlayed(value);
      playerRef?.current?.seekTo?.(value);
    }
  };

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    if (mustPlayed !== null && (playedSeconds - mustPlayed > 2 || playedSeconds < mustPlayed)) {
      handleSeek(mustPlayed);
    } else {
      setMustPlayed(null);
      setPlayed(playedSeconds);
    }
  };

  const handleSetAudio = (audioSrc: string, title: string, played?: number) => {
    setSrc(audioSrc);
    setTitle(title);
    setPlayed(played ?? 0);
  };

  return (
    <PlayerContext.Provider
      value={{
        setAudio: handleSetAudio,
        seek: handleSeek,
        handlePlayPause,
        src,
        title,
        played,
        duration,
        isPlaying,
        openInterface,
        setOpenInterface,
      }}
    >
      <ReactPlayer
        url={src ?? undefined}
        playing={isPlaying}
        onProgress={handleProgress}
        onDuration={handleDuration}
        height="0"
        width="0"
        ref={playerRef}
      />
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
