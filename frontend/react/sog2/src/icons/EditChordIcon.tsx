// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';

const EditChordIcon = ({ props }: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M.99 19h2.42l1.27-3.58h5.65L11.59 19h2.42L8.75 5h-2.5L.99 19zm4.42-5.61L7.44 7.6h.12l2.03 5.79H5.41zM23"
          fill="currentColor"
        />
        <path
          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"
          style={{ scale: '0.4', transform: 'translate(33px, 3px)' }}
          fill="currentColor"
        />
      </svg>
    </SvgIcon>
  );
};

export default EditChordIcon;
