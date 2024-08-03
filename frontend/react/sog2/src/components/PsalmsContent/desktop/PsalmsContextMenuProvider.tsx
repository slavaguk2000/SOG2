import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import { Menu, MenuItem } from '@mui/material';

import { usePsalmsBooksData } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsBooksProvider';
import { Maybe, MusicalKey } from '../../../utils/gql/types';

import SongTransposer from './SongTransposer';
import useTransposeSong from './useTransposeSong';

interface MenuAnchorData {
  anchor: HTMLElement;
  psalmId: string;
  defaultTonality?: Maybe<MusicalKey>;
}

interface PsalmsContextMenuProviderType {
  menuAnchorData: MenuAnchorData | null;
  handleContextMenu: <T extends HTMLElement>(
    event: React.MouseEvent<T>,
    psalmId: string,
    defaultTonality?: Maybe<MusicalKey>,
  ) => void;
}

const defaultValue: PsalmsContextMenuProviderType = {
  menuAnchorData: null,
  handleContextMenu: () => true,
};

const PsalmsContextMenuContext = createContext<PsalmsContextMenuProviderType>(defaultValue);

PsalmsContextMenuContext.displayName = 'PsalmsContextMenuContext';

export const usePsalmsContextMenu = () => {
  return useContext(PsalmsContextMenuContext);
};

const PsalmsContextMenuProvider = ({ children }: PropsWithChildren) => {
  const [menuAnchorData, setMenuAnchorData] = useState<null | MenuAnchorData>(null);

  const handleMenuClose = () => {
    setMenuAnchorData(null);
  };

  const handleEditChords = () => {
    if (menuAnchorData) {
      const url = `/psalms/chords-edit?psalmId=${menuAnchorData.psalmId}`;
      window.open(url, '_blank');
    }
    handleMenuClose();
  };

  const { currentPsalmBook } = usePsalmsBooksData();

  const { handleTransposeSong, handleUpdateTranspose } = useTransposeSong(
    currentPsalmBook?.id,
    menuAnchorData?.psalmId,
    menuAnchorData?.defaultTonality,
    handleMenuClose,
  );

  const handleContextMenu = <T extends HTMLElement>(
    event: React.MouseEvent<T>,
    psalmId: string,
    defaultTonality?: Maybe<MusicalKey>,
  ) => {
    event.preventDefault();
    setMenuAnchorData({ anchor: event.currentTarget, psalmId, defaultTonality });
  };

  return (
    <PsalmsContextMenuContext.Provider
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
          <MenuItem tabIndex={-1} onClick={handleEditChords}>
            Edit chords
          </MenuItem>
        )}
        {menuAnchorData?.defaultTonality && (
          <MenuItem tabIndex={-1} onClick={handleTransposeSong}>
            <SongTransposer
              defaultTonality={menuAnchorData.defaultTonality}
              onUpdateTranspose={handleUpdateTranspose}
            />
          </MenuItem>
        )}
      </Menu>
    </PsalmsContextMenuContext.Provider>
  );
};

export default PsalmsContextMenuProvider;
