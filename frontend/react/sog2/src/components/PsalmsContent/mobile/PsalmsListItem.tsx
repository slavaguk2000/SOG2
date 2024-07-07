import React, { CSSProperties, useEffect, useState } from 'react';

import { ListItem, ListItemButton, ListItemText } from '@mui/material';

import { useFavouriteData } from '../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { usePsalms } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';
import InFavouriteIconButton from '../common/InFavouriteIconButton';

interface PsalmsListItemProps {
  index: number;
  style: CSSProperties;
}

const PsalmsListItem = ({ index, style }: PsalmsListItemProps) => {
  const { psalmsData } = usePsalms();
  const { favouritePsalmsDataMap } = useFavouriteData();

  const currentPsalm = psalmsData?.[index];

  const inFavourite = !!(currentPsalm && favouritePsalmsDataMap[currentPsalm?.id]);

  const [internalFavouriteState, setInternalFavouriteState] = useState(inFavourite);

  if (!currentPsalm) {
    return <ListItem style={style} />;
  }

  return (
    <ListItem
      sx={{ background: internalFavouriteState ? '#0253' : undefined, height: '100%', width: '100%' }}
      disablePadding
      style={style}
      secondaryAction={
        <InFavouriteIconButton
          psalmId={currentPsalm.id}
          transposition={currentPsalm.transposition}
          value={internalFavouriteState}
          onChange={setInternalFavouriteState}
        />
      }
    >
      <ListItemButton sx={{ height: '100%', width: '100%' }}>
        <ListItemText primary={`${currentPsalm.psalmNumber} ${currentPsalm.name}`} />
      </ListItemButton>
    </ListItem>
  );
};

export default PsalmsListItem;
