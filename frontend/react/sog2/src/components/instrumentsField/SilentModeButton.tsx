import React from 'react';

import LeakAddIcon from '@mui/icons-material/LeakAdd';
import LeakRemoveIcon from '@mui/icons-material/LeakRemove';
import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { useBibleData } from 'src/providers/bibleDataProvider';

const SilentModeButton = () => {
  const { silentMode, setSilentMode } = useBibleData();

  const handleClick = () => {
    setSilentMode((prev) => !prev);
  };

  return (
    <Tooltip title="Silent mode">
      <IconButton onClick={handleClick}>{silentMode ? <LeakAddIcon /> : <LeakRemoveIcon />}</IconButton>
    </Tooltip>
  );
};

export default SilentModeButton;
