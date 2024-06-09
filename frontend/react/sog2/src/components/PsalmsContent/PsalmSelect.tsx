import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Menu, MenuItem } from '@mui/material';

import { usePsalmsData } from '../../providers/dataProviders/psalmsDataProvider';

import PsalmSelectItem from './PsalmSelectItem';
import { PsalmSelectWrapper } from './styled';

const PsalmSelect = () => {
  const [menuAnchorData, setMenuAnchorData] = useState<null | { anchor: HTMLElement; psalmId: string }>(null);
  const { psalmsData, handlePsalmSelect, currentPsalm } = usePsalmsData();
  const navigate = useNavigate();

  const preparedData = useMemo(
    () =>
      psalmsData?.map(({ id, name, psalmNumber, defaultTonality, inFavourite }) => {
        return {
          id,
          name: `${psalmNumber ? `${psalmNumber} ` : ''}${name}${defaultTonality ? ` (${defaultTonality})` : ''}`,
          inFavourite,
        };
      }),
    [psalmsData],
  );

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>, psalmId: string) => {
    event.preventDefault();
    setMenuAnchorData({ anchor: event.currentTarget, psalmId });
  };

  const handleMenuClose = () => {
    setMenuAnchorData(null);
  };

  const handleEditChords = () => {
    if (menuAnchorData) {
      navigate(`/psalms/chords-edit?psalmId=${menuAnchorData.psalmId}`);
    }
    handleMenuClose();
  };

  return (
    <PsalmSelectWrapper>
      {preparedData?.map(({ name, id, inFavourite }) => (
        <Box key={id} onContextMenu={(e) => handleContextMenu(e, id)}>
          <PsalmSelectItem
            psalmName={name}
            selected={id === currentPsalm?.id}
            onClick={() => handlePsalmSelect(id)}
            psalmId={id}
            inFavourite={inFavourite ?? undefined}
          />
        </Box>
      ))}
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
      </Menu>
    </PsalmSelectWrapper>
  );
};

export default PsalmSelect;
