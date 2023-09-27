import React from 'react';

import LeakAddIcon from '@mui/icons-material/LeakAdd';
import LeakRemoveIcon from '@mui/icons-material/LeakRemove';
import { IconButton } from '@mui/material';

import { useBibleData } from 'src/providers/bibleDataProvider';

const SilentModeButton = () => {
  const { silentMode, setSilentMode } = useBibleData();

  const handleClick = () => {
    setSilentMode((prev) => !prev);
  };

  return <IconButton onClick={handleClick}>{silentMode ? <LeakAddIcon /> : <LeakRemoveIcon />}</IconButton>;
};

export default SilentModeButton;
