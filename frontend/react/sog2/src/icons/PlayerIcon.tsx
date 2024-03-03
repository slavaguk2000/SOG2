// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';

interface PlayerIconProps extends SvgIconProps {
  progress: number;
}

const PlayerIcon = ({ progress, ...props }: PlayerIconProps) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);

  const strokeDashoffset = 45.553 * (1 - normalizedProgress);

  return (
    <SvgIcon {...props}>
      <svg width="20" height="20" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12
        7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"
          fill="currentColor"
        />
        <circle
          cx="12"
          cy="12"
          r="7.25"
          stroke="#0078D4"
          strokeWidth="5.6"
          strokeDasharray="45.553"
          strokeDashoffset={strokeDashoffset}
          fill="none"
        />
      </svg>
    </SvgIcon>
  );
};

export default PlayerIcon;
