import React from 'react';

import { IconButton, Tooltip } from '@mui/material';

import { usePresentation } from 'src/providers/presentationProvider';

import ChordClosePresentationIcon from '../../icons/ChordClosePresentationIcon';
import ChordPresentationIcon from '../../icons/ChordPresentationIcon';

const CaptureChordsScreen = () => {
  const { captureChordScreen, releaseChordScreen, validChordSession } = usePresentation();

  return validChordSession ? (
    <Tooltip title="Release chord screen">
      <IconButton onClick={releaseChordScreen}>
        <ChordClosePresentationIcon />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip title="Capture chord screen">
      <IconButton onClick={captureChordScreen}>
        <ChordPresentationIcon />
      </IconButton>
    </Tooltip>
  );
};

export default CaptureChordsScreen;
