import React, { useMemo, useState } from 'react';

import { Box, Menu, MenuItem } from '@mui/material';
import { Reorder } from 'framer-motion';

import useReorder from '../../../hooks/useReorder';
import useSelectIntent from '../../../hooks/useSelectIntent';
import { usePsalmsData } from '../../../providers/dataProviders/psalmsDataProvider';
import { Maybe, MusicalKey } from '../../../utils/gql/types';

import PsalmSelectItem from './PsalmSelectItem';
import SongTransposer from './SongTransposer';
import { PsalmSelectWrapper } from './styled';
import useTransposeSong from './useTransposeSong';

interface PsalmSelectItemType {
  transposition: number;
  defaultTonality: MusicalKey | null | undefined;
  inFavourite: boolean;
  name: string;
  id: string;
}

const PsalmSelect = () => {
  const [menuAnchorData, setMenuAnchorData] = useState<null | {
    anchor: HTMLElement;
    psalmId: string;
    defaultTonality?: Maybe<MusicalKey>;
  }>(null);
  const { psalmsData, handlePsalmSelect, currentPsalm, currentPsalmBook, handlePsalmsReorder } = usePsalmsData();
  const { softSelected, setSoftSelected } = useSelectIntent({
    hardSelected: currentPsalm?.id,
    setHardSelected: handlePsalmSelect,
    timeout: 100,
  });

  const canBeReordered = !!currentPsalmBook?.isFavourite;

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
      const url = `/psalms/chords-edit?psalmId=${menuAnchorData.psalmId}`;
      window.open(url, '_blank');
    }
    handleMenuClose();
  };

  const { handleTransposeSong, handleUpdateTranspose } = useTransposeSong(
    currentPsalmBook?.id,
    menuAnchorData?.psalmId,
    menuAnchorData?.defaultTonality,
    handleMenuClose,
  );

  const { orderableData, onReorder } = useReorder<PsalmSelectItemType>({
    backendData: preparedData ?? [],
    updateBackend: (items) => handlePsalmsReorder(items.map(({ id }) => id)),
  });

  const itemMapper = ({ id, name, inFavourite, transposition, defaultTonality }: PsalmSelectItemType) => (
    <Box key={id} onContextMenu={(e) => handleContextMenu(e, id, defaultTonality)}>
      <PsalmSelectItem
        psalmName={name}
        selected={id === softSelected}
        onClick={() => setSoftSelected(id, transposition)}
        psalmId={id}
        inFavourite={inFavourite ?? undefined}
        transposition={transposition}
      />
    </Box>
  );

  return orderableData ? (
    <PsalmSelectWrapper>
      {canBeReordered ? (
        <Reorder.Group axis="y" values={orderableData} onReorder={onReorder}>
          {orderableData.map((item) => (
            <Reorder.Item key={item.id} value={item}>
              {itemMapper(item)}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        orderableData.map(itemMapper)
      )}
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
  ) : null;
};

export default PsalmSelect;
