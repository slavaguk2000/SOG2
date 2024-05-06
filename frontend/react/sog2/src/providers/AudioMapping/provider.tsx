import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

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
