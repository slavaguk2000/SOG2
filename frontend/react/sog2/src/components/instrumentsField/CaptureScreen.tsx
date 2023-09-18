import React from 'react';

import AirplayIcon from '@mui/icons-material/Airplay';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import { IconButton } from '@mui/material';

import { usePresentation } from 'src/providers/presentationProvider';

const CaptureScreen = () => {
  const { captureTextScreen, releaseTextScreen, validSession } = usePresentation();

  return validSession ? (
    <IconButton onClick={releaseTextScreen}>
      <DesktopAccessDisabledIcon />
    </IconButton>
  ) : (
    <IconButton onClick={captureTextScreen}>
      <AirplayIcon />
    </IconButton>
  );
};

export default CaptureScreen;
