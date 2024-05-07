import React, { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

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

const xorDispatchFactory =
  (currentDispatch: Dispatch<SetStateAction<boolean>>, anotherDispatch: Dispatch<SetStateAction<boolean>>) =>
  (action: SetStateAction<boolean>) => {
    if (typeof action === 'function') {
      currentDispatch((p) => {
        const newValue = action(p);

        if (newValue) {
          anotherDispatch(false);
        }

        return newValue;
      });
    } else {
      if (action) {
        anotherDispatch(false);
      }

      currentDispatch(action);
    }
  };

const AudioMappingProvider = ({ children }: PropsWithChildren) => {
  const [follow, setFollow] = useState(false);
  const [recording, setRecording] = useState(false);

  const handleRecording: Dispatch<SetStateAction<boolean>> = xorDispatchFactory(setRecording, setFollow);

  const handleFollow: Dispatch<SetStateAction<boolean>> = xorDispatchFactory(setFollow, setRecording);

  return (
    <AudioMappingProviderContext.Provider
      value={{
        follow,
        setFollow: handleFollow,
        recording,
        setRecording: handleRecording,
      }}
    >
      {children}
    </AudioMappingProviderContext.Provider>
  );
};

export default AudioMappingProvider;
