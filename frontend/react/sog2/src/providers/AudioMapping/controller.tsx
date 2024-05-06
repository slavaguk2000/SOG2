import React from 'react';

import LocationDisabledIcon from '@mui/icons-material/LocationDisabled';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Button, Tooltip } from '@mui/material';

import { useAudioMapping } from './provider';
import { AudioMappingControllerWrapper } from './styled';

const AudioMappingController = () => {
  const { recording, setRecording, follow, setFollow } = useAudioMapping();

  return (
    <AudioMappingControllerWrapper>
      <Tooltip title={'Follow text time mapping'}>
        <Button onClick={() => setFollow((p) => !p)}>
          {follow ? <LocationSearchingIcon /> : <LocationDisabledIcon />}
        </Button>
      </Tooltip>
      <Tooltip title={'Record text time mapping'}>
        <Button onClick={() => setRecording((p) => !p)}>
          <RadioButtonCheckedIcon color={recording ? 'error' : undefined} />
        </Button>
      </Tooltip>
    </AudioMappingControllerWrapper>
  );
};

export default AudioMappingController;
