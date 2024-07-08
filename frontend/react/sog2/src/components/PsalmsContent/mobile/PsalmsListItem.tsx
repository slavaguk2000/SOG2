import React, { CSSProperties, useEffect, useState, TouchEvent } from 'react';

import { ListItem, ListItemButton, ListItemText, Theme, SxProps } from '@mui/material';
import { useLongPress } from '@uidotdev/usehooks';

import { useCurrentPsalms } from '../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import { useFavouriteData } from '../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { usePsalms } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';
import FavouriteIconButton, { FavouriteIconButtonBody } from '../common/InFavouriteIconButton';

import { usePsalmsContentMobileContext } from './PsalmsContentMobileContextProvider';
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
  const { handlePsalmSelect, currentPsalm: selectedPsalm } = useCurrentPsalms();
  const { favouritePsalmsDataMap, favouriteReady } = useFavouriteData();
  const { setPreviewChordsPsalmData } = usePsalmsContentMobileContext();

  const currentPsalm = psalmsData?.[index];

  const inFavourite = !!(currentPsalm && favouritePsalmsDataMap[currentPsalm?.id]);

  const [internalFavouriteState, setInternalFavouriteState] = useState(inFavourite);

  useEffect(() => {
    if (favouriteReady) {
      setInternalFavouriteState(inFavourite);
    }
  }, [favouriteReady, inFavourite]);

  const longPressAttrs = useLongPress(
    (e: Event) => {
      const touch = (e as unknown as TouchEvent).touches?.[0];
      if (currentPsalm) {
        setPreviewChordsPsalmData({
          psalmData: {
            id: currentPsalm.id,
            transposition: currentPsalm.transposition,
          },
          position: touch
            ? {
                x: touch.clientX,
                y: touch.clientY,
              }
            : undefined,
        });
      }
    },
    {
      threshold: 500,
    },
  );

  if (!currentPsalm) {
    return <ListItem style={style} />;
  }

  const handleSelectItem = () => {
    handlePsalmSelect(currentPsalm.id);
  };

  return (
    <StyledListItem sx={{ background: internalFavouriteState ? '#0253' : undefined }} disablePadding style={style}>
      <ListItemButton sx={{ height: '100%', width: '100%', padding: 0 }} onClick={handleSelectItem} {...longPressAttrs}>
        <ListItemText
          sx={{ margin: selectedPsalm ? '0 16px 0 5px' : '0 16px', transition: 'all 0.2s ease-out' }}
          primary={`${currentPsalm.psalmNumber} ${currentPsalm.name}`}
        />
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
