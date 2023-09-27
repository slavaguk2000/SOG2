import React from 'react';

import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported';
import CastIcon from '@mui/icons-material/Cast';
import { IconButton, Tooltip } from '@mui/material';

import { usePresentation } from 'src/providers/presentationProvider';

const CaptureScreen = () => {
  const { captureTextScreen, releaseTextScreen, validSession } = usePresentation();

  return validSession ? (
    <Tooltip title="Release screen">
      <IconButton onClick={releaseTextScreen}>
        <BrowserNotSupportedIcon />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip title="Capture screen">
      <IconButton onClick={captureTextScreen}>
        <CastIcon />
      </IconButton>
    </Tooltip>
  );
};

export default CaptureScreen;
