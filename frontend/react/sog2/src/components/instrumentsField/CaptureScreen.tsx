import React from 'react';

import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported';
import CastIcon from '@mui/icons-material/Cast';
import { IconButton } from '@mui/material';

import { usePresentation } from 'src/providers/presentationProvider';

const CaptureScreen = () => {
  const { captureTextScreen, releaseTextScreen, validSession } = usePresentation();

  return validSession ? (
    <IconButton onClick={releaseTextScreen}>
      <BrowserNotSupportedIcon />
    </IconButton>
  ) : (
    <IconButton onClick={captureTextScreen}>
      <CastIcon />
    </IconButton>
  );
};

export default CaptureScreen;
