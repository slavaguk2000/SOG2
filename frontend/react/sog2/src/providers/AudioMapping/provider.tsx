import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { AudioMappingProviderContextType } from '../types';

const defaultValue: AudioMappingProviderContextType = {
  setFollow: () => true,
  setRecording: () => true,
  follow: false,
  recording: false,
};

const AudioMappingProviderContext = createContext<AudioMappingProviderContextType>(defaultValue);

AudioMappingProviderContext.displayName = 'AudioMappingProviderContext';

export const useAudioMapping = () => {
  return useContext(AudioMappingProviderContext);
};

const AudioMappingProvider = ({ children }: PropsWithChildren) => {
  const [follow, setFollow] = useState(false);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (follow) {
      setRecording(false);
    }
  }, [follow]);

  useEffect(() => {
    if (recording) {
      setFollow(false);
    }
  }, [recording]);

  return (
    <AudioMappingProviderContext.Provider
      value={{
        follow,
        setFollow,
        recording,
        setRecording,
      }}
    >
      {children}
    </AudioMappingProviderContext.Provider>
  );
};

export default AudioMappingProvider;
