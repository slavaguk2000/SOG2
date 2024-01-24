import React, { FC, PropsWithChildren, ReactNode } from 'react';

import { Box, IconButton, Popover, Tooltip } from '@mui/material';
import { SxProps } from '@mui/system/styleFunctionSx';

interface InstrumentWithPopperProps extends PropsWithChildren {
  icon: ReactNode;
  tooltip: string;
  disabled?: boolean;
  popoverSx?: SxProps;
}

const InstrumentWithPopper: FC<InstrumentWithPopperProps> = ({ children, icon, tooltip, disabled, popoverSx }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl && children);

  return (
    <Box>
      <Tooltip title={tooltip}>
        <IconButton onClick={handleClick} disabled={disabled}>
          {icon}
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={popoverSx}
      >
        {children}
      </Popover>
    </Box>
  );
};

export default InstrumentWithPopper;
