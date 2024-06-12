// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';

const ChordClosePresentationIcon = ({ props }: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M19 6v10.5l1.95 1.95c.03-.15.05-.3.05-.45V6c0-1.1-.9-2-2-2H6.5l2 2H19zM3.22 3.32 1.95 4.59 3 5.64V18c0 1.1.9 2 2 2h12.36l2.06 2.06 1.27-1.27L3.22 3.32zM15 18H5V7.64L15.36 18H15z"
          fill="currentColor"
        />
        <path
          d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3z"
          fill="currentColor"
        />
      </svg>
    </SvgIcon>
  );
};

export default ChordClosePresentationIcon;
