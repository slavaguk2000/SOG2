import React from 'react';

import LeakAddIcon from '@mui/icons-material/LeakAdd';
import LeakRemoveIcon from '@mui/icons-material/LeakRemove';
import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { useInstrumentsField } from '../../providers/instrumentsFieldProvider';

const SilentModeButton = () => {
  const { silentMode, setSilentMode } = useInstrumentsField();

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
