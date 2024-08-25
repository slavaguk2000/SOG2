import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import { Menu, MenuItem } from '@mui/material';

import AddPsalmDialog from './AddPsalmDialog';

interface MenuAnchorData {
  anchor: HTMLElement;
  psalmBookId: string;
}

interface PsalmBooksContextMenuProviderType {
  menuAnchorData: MenuAnchorData | null;
  handleContextMenu: <T extends HTMLElement>(event: React.MouseEvent<T>, psalmBookId: string) => void;
}

const defaultValue: PsalmBooksContextMenuProviderType = {
  menuAnchorData: null,
  handleContextMenu: () => true,
};

const PsalmBooksContextMenuContext = createContext<PsalmBooksContextMenuProviderType>(defaultValue);

PsalmBooksContextMenuContext.displayName = 'PsalmBooksContextMenuContext';

export const usePsalmBooksContextMenu = () => {
  return useContext(PsalmBooksContextMenuContext);
};

const PsalmBooksContextMenuProvider = ({ children }: PropsWithChildren) => {
  const [menuAnchorData, setMenuAnchorData] = useState<null | MenuAnchorData>(null);
  const [addPsalmDialogData, setAddPsalmDialogData] = useState<null | { psalmBookId: string }>(null);

  const handleMenuClose = () => {
    setMenuAnchorData(null);
  };

  const handleAddPsalm = () => {
    if (menuAnchorData?.psalmBookId) {
      setAddPsalmDialogData({ psalmBookId: menuAnchorData.psalmBookId });
    }
    handleMenuClose();
  };

  const handleContextMenu = <T extends HTMLElement>(event: React.MouseEvent<T>, psalmBookId: string) => {
    event.preventDefault();
    setMenuAnchorData({ anchor: event.currentTarget, psalmBookId });
  };

  return (
    <PsalmBooksContextMenuContext.Provider
      value={{
        menuAnchorData,
        handleContextMenu,
      }}
    >
      {children}
      <Menu
        anchorEl={menuAnchorData?.anchor}
        open={Boolean(menuAnchorData)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {menuAnchorData && (
          <MenuItem tabIndex={-1} onClick={handleAddPsalm}>
            Add psalm
          </MenuItem>
        )}
      </Menu>
      <AddPsalmDialog
        psalmBookId={addPsalmDialogData?.psalmBookId}
        open={!!addPsalmDialogData}
        onClose={() => setAddPsalmDialogData(null)}
      />
    </PsalmBooksContextMenuContext.Provider>
  );
};

export default PsalmBooksContextMenuProvider;
