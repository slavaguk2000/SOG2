import React, { CSSProperties, useEffect, useState } from 'react';

import { ListItem } from '@mui/material';

import { useFavouriteData } from '../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { usePsalms } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';

import PsalmItem from './PsalmItem';
import { StyledListItem } from './styled';

interface PsalmsListItemProps {
  index: number;
  style: CSSProperties;
}

const PsalmsListItem = ({ index, style }: PsalmsListItemProps) => {
  const { psalmsData } = usePsalms();
  const { favouritePsalmsDataMap, favouriteReady } = useFavouriteData();

  const currentPsalm = psalmsData?.[index];

  const inFavourite = !!(currentPsalm && favouritePsalmsDataMap[currentPsalm?.id]);

  const [internalFavouriteState, setInternalFavouriteState] = useState(inFavourite);

  useEffect(() => {
    if (favouriteReady) {
      setInternalFavouriteState(inFavourite);
    }
  }, [favouriteReady, inFavourite]);

  if (!currentPsalm) {
    return <ListItem style={style} />;
  }

  return (
    <StyledListItem disablePadding style={style}>
      <PsalmItem
        inFavourite={internalFavouriteState}
        name={currentPsalm.name}
        psalmNumber={currentPsalm.psalmNumber}
        psalmId={currentPsalm.id}
        transposition={currentPsalm.transposition}
        onFavouriteChange={setInternalFavouriteState}
      />
    </StyledListItem>
  );
};

export default PsalmsListItem;
