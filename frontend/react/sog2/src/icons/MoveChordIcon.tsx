import React from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';

const MoveChordIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12.75 3h-1.5L6.5 14h2.1l.9-2.2h5l.9 2.2h2.1zm-2.62 7L12 4.98 13.87 10zm10.37 8-3-3v2h-11v-2l-3 3l3 3v-2h11v2z" />
      </svg>
    </SvgIcon>
  );
};

export default MoveChordIcon;
