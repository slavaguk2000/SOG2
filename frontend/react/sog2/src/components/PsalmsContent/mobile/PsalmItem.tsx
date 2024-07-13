import React, { Dispatch, ReactElement, SetStateAction, TouchEvent } from 'react';

import { Box, ListItemButton, SxProps, Theme } from '@mui/material';
import { useLongPress } from '@uidotdev/usehooks';

import { useCurrentPsalms } from '../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import { useFavouriteData } from '../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { Maybe } from '../../../utils/gql/types';
import FavouriteIconButton, { FavouriteIconButtonBody } from '../common/InFavouriteIconButton';

import { usePsalmsContentMobileContext } from './PsalmsContentMobileContextProvider';
import { ListItemContentBackground, StyledListItemText } from './styled';

interface PsalmItemProps {
  inFavourite: boolean;
  psalmId: string;
  name: string;
  psalmNumber?: Maybe<string>;
  transposition: number;
  onFavouriteChange?: Dispatch<SetStateAction<boolean>>;
  reorderIcon?: ReactElement;
}

const favouriteIconButtonSx: SxProps<Theme> = {
  height: '100%',
  width: '60px',
  padding: '0 10px',
  borderRadius: 0,
};

const PsalmItem = ({
  inFavourite,
  psalmId,
  name,
  psalmNumber,
  transposition,
  onFavouriteChange,
  reorderIcon,
}: PsalmItemProps) => {
  const { handlePsalmSelect, currentPsalm: selectedPsalm } = useCurrentPsalms();
  const { favouriteReady } = useFavouriteData();
  const { setPreviewChordsPsalmData } = usePsalmsContentMobileContext();

  const longPressAttrs = useLongPress(
    (e: Event) => {
      const touch = (e as unknown as TouchEvent).touches?.[0];

      setPreviewChordsPsalmData({
        psalmData: {
          id: psalmId,
          transposition,
        },
        position: touch
          ? {
              x: touch.clientX,
              y: touch.clientY,
            }
          : undefined,
      });
    },
    {
      threshold: 500,
    },
  );

  const handleSelectItem = () => {
    handlePsalmSelect(psalmId);
  };

  return (
    <ListItemContentBackground>
      <Box sx={{ background: inFavourite ? '#0253' : undefined, height: '100%', width: '100%' }}>
        <ListItemButton sx={{ height: '100%', width: '100%', padding: 0 }} onClick={handleSelectItem}>
          {reorderIcon}
          <StyledListItemText
            isDrawerOpen={!!selectedPsalm}
            isSortable={!!reorderIcon}
            primary={`${psalmNumber} ${name}`}
            {...longPressAttrs}
          />
          <Box position="absolute" right={0} height="100%">
            {favouriteReady ? (
              <FavouriteIconButton
                psalmId={psalmId}
                transposition={transposition}
                onChange={onFavouriteChange}
                sx={favouriteIconButtonSx}
              />
            ) : (
              <FavouriteIconButtonBody sx={favouriteIconButtonSx} />
            )}
          </Box>
        </ListItemButton>
      </Box>
    </ListItemContentBackground>
  );
};

export default PsalmItem;
