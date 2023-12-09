import React from 'react';

import HistoryIcon from '@mui/icons-material/History';
import { IconButton, MenuItem, MenuList, Popover, Typography } from '@mui/material';

import { HistoryInstrumentIconWrapper } from './styled';

const History = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setAnchorEl(null);
    } else if (event.key === 'Escape') {
      setAnchorEl(null);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <HistoryInstrumentIconWrapper>
      <IconButton onClick={handleClick}>
        <HistoryIcon />
      </IconButton>

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
      >
        <MenuList
          autoFocusItem={open}
          id="composition-menu"
          aria-labelledby="composition-button"
          onKeyDown={handleListKeyDown}
        >
          {Array.from({ length: 20 }).map((_, idx) => (
            <MenuItem key={idx} onClick={handleClose}>
              <Typography>{`Profile ${idx}`}</Typography>
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </HistoryInstrumentIconWrapper>
  );
};

export default History;
