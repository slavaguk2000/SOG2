import React from 'react';

import { Menu, MenuItem } from '@mui/material';

import { useEditableChordsData } from './editableChordsDataProvider';

export interface MenuAnchorChordData {
  anchor: HTMLElement;
  contentId: string;
}

export interface LinkChordMenuProps {
  menuAnchorChordData: MenuAnchorChordData | null;
  onClose: () => void;
}

const LinkChordMenu = ({ menuAnchorChordData, onClose }: LinkChordMenuProps) => {
  const { handleUnlinkChord } = useEditableChordsData();

  const onUnlinkChordClick = () => {
    if (menuAnchorChordData) {
      handleUnlinkChord(menuAnchorChordData.contentId);
    }
    onClose();
  };

  return (
    <Menu
      anchorEl={menuAnchorChordData?.anchor}
      open={Boolean(menuAnchorChordData)}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {menuAnchorChordData && (
        <MenuItem tabIndex={-1} onClick={onUnlinkChordClick}>
          Unlink chord
        </MenuItem>
      )}
    </Menu>
  );
};

export default LinkChordMenu;
