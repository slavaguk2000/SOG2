import React, { CSSProperties, useState } from 'react';

import { ListItem, ListItemButton, ListItemText, Theme, SxProps } from '@mui/material';

import { useFavouriteData } from '../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { usePsalms } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';
import FavouriteIconButton, { FavouriteIconButtonBody } from '../common/InFavouriteIconButton';

import { StyledListItem } from './styled';

interface PsalmsListItemProps {
  index: number;
  style: CSSProperties;
}

const favouriteIconButtonSx: SxProps<Theme> = {
  height: '100%',
  width: '60px',
  padding: '0 10px',
  borderRadius: 0,
};

const PsalmsListItem = ({ index, style }: PsalmsListItemProps) => {
  const { psalmsData } = usePsalms();
  const { favouritePsalmsDataMap, favouriteReady } = useFavouriteData();

  const currentPsalm = psalmsData?.[index];

  const inFavourite = !!(currentPsalm && favouritePsalmsDataMap[currentPsalm?.id]);

  const [internalFavouriteState, setInternalFavouriteState] = useState(inFavourite);

  if (!currentPsalm) {
    return <ListItem style={style} />;
  }

  return (
    <StyledListItem sx={{ background: internalFavouriteState ? '#0253' : undefined }} disablePadding style={style}>
      <ListItemButton sx={{ height: '100%', width: '100%', padding: 0 }}>
        <ListItemText sx={{ padding: '0 16px' }} primary={`${currentPsalm.psalmNumber} ${currentPsalm.name}`} />
        {favouriteReady ? (
          <FavouriteIconButton
            psalmId={currentPsalm.id}
            transposition={currentPsalm.transposition}
            onChange={setInternalFavouriteState}
            sx={favouriteIconButtonSx}
          />
        ) : (
          <FavouriteIconButtonBody sx={favouriteIconButtonSx} />
        )}
      </ListItemButton>
    </StyledListItem>
  );
};

export default PsalmsListItem;
