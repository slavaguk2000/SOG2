import React, { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from 'react';

import TurnedInIcon from '@mui/icons-material/TurnedIn';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import { Box, SxProps, Theme } from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';

import useAddRemoveFavourite from '../../../hooks/useAddRemoveFavourite';
import { useFavouriteData } from '../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { StyledIconButton } from '../desktop/styled';

export interface FavouriteIconButtonBodyProps {
  currentState?: boolean;
  onClick?: MouseEventHandler;
  sx?: SxProps<Theme>;
}

export const FavouriteIconSkeleton = () => <Box width="34px" />;

export const FavouriteIconButtonBody = ({ currentState, onClick, sx }: FavouriteIconButtonBodyProps) => (
  <StyledIconButton sx={sx} size="small" onClick={onClick}>
    {currentState ? <TurnedInIcon /> : <TurnedInNotIcon />}
  </StyledIconButton>
);

export interface FavouriteIconButtonProps {
  psalmId: string;
  psalmsBookId?: string;
  inFavourite?: boolean;
  transposition?: number;
  value?: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
  sx?: SxProps<Theme>;
  stopPropagation?: boolean;
}

const FavouriteIconButton = ({
  psalmId,
  psalmsBookId,
  transposition,
  value,
  onChange,
  sx,
  stopPropagation = true,
}: FavouriteIconButtonProps) => {
  const { favouritePsalmsDataMap, favouriteReady } = useFavouriteData();

  const inFavourite = !!favouritePsalmsDataMap[psalmId];

  const [internalFavouriteState, setInternalFavouriteState] = useState(inFavourite);

  useEffect(() => {
    if (favouriteReady) {
      setInternalFavouriteState(inFavourite);
    }
  }, [favouriteReady, inFavourite]);

  const { addPsalmToFavouriteMutation, removePsalmFromFavouriteMutation } = useAddRemoveFavourite({
    psalmId,
    psalmsBookId,
    transposition,
  });

  const debounced = useDebouncedCallback(async (mustBe: boolean) => {
    if (mustBe !== inFavourite) {
      try {
        if (mustBe) {
          await addPsalmToFavouriteMutation();
        } else {
          await removePsalmFromFavouriteMutation();
        }
      } catch (e) {
        setInternalFavouriteState(inFavourite);
      }
    }
  }, 1000);

  useEffect(() => {
    debounced(internalFavouriteState);
  }, [internalFavouriteState, debounced]);

  const justInternal = value === undefined;

  const handleFavouriteIconClick: MouseEventHandler = (e) => {
    if (stopPropagation) {
      e.stopPropagation();
    }

    if (justInternal) {
      setInternalFavouriteState((prevState) => {
        const newValue = !prevState;
        onChange?.(newValue);
        return newValue;
      });
    } else if (onChange) {
      onChange((prevState) => {
        const newValue = !prevState;
        setInternalFavouriteState(newValue);
        return newValue;
      });
    } else {
      setInternalFavouriteState(!value);
    }
  };

  const currentState = justInternal ? internalFavouriteState : value;

  return <FavouriteIconButtonBody sx={sx} currentState={currentState} onClick={handleFavouriteIconClick} />;
};

export default FavouriteIconButton;
