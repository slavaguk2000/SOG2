import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Menu, MenuItem } from '@mui/material';

import { usePsalmsData } from '../../providers/dataProviders/psalmsDataProvider';
import { Maybe, MusicalKey } from '../../utils/gql/types';

import PsalmSelectItem from './PsalmSelectItem';
import SongTransposer from './SongTransposer';
import { PsalmSelectWrapper } from './styled';
import useTransposeSong from './useTransposeSong';

const PsalmSelect = () => {
  const [menuAnchorData, setMenuAnchorData] = useState<null | {
    anchor: HTMLElement;
    psalmId: string;
    defaultTonality?: Maybe<MusicalKey>;
  }>(null);
  const { psalmsData, handlePsalmSelect, currentPsalm, currentPsalmBook } = usePsalmsData();
  const navigate = useNavigate();

  const preparedData = useMemo(
    () =>
      psalmsData?.map(({ id, name, psalmNumber, defaultTonality, tonality, inFavourite, transposition }) => {
        return {
          id,
          name: `${psalmNumber ? `${psalmNumber} ` : ''}${name}${defaultTonality ? ` (${tonality})` : ''}`,
          inFavourite,
          defaultTonality,
          transposition,
        };
      }),
    [psalmsData],
  );

  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    psalmId: string,
    defaultTonality?: Maybe<MusicalKey>,
  ) => {
    event.preventDefault();
    setMenuAnchorData({ anchor: event.currentTarget, psalmId, defaultTonality });
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

  const { handleTransposeSong, handleUpdateTranspose } = useTransposeSong(
    currentPsalmBook?.id,
    menuAnchorData?.psalmId,
    menuAnchorData?.defaultTonality,
    handleMenuClose,
  );

  return (
    <PsalmSelectWrapper>
      {preparedData?.map(({ name, id, inFavourite, defaultTonality, transposition }) => (
        <Box key={id} onContextMenu={(e) => handleContextMenu(e, id, defaultTonality)}>
          <PsalmSelectItem
            psalmName={name}
            selected={id === currentPsalm?.id}
            onClick={() => handlePsalmSelect(id, transposition)}
            psalmId={id}
            inFavourite={inFavourite ?? undefined}
            transposition={transposition}
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
        {menuAnchorData?.defaultTonality && (
          <MenuItem tabIndex={-1} onClick={handleTransposeSong}>
            <SongTransposer
              defaultTonality={menuAnchorData.defaultTonality}
              onUpdateTranspose={handleUpdateTranspose}
            />
          </MenuItem>
        )}
      </Menu>
    </PsalmSelectWrapper>
  );
};

export default PsalmSelect;
