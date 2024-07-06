import React, { MouseEventHandler, useEffect, useState } from 'react';

import TurnedInIcon from '@mui/icons-material/TurnedIn';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import { useDebouncedCallback } from 'use-debounce';

import useAddRemoveFavourite from '../../../hooks/useAddRemoveFavourite';
import { usePsalmsData } from '../../../providers/dataProviders/psalmsDataProvider';
import { StyledIconButton } from '../desktop/styled';

export interface InFavouriteIconButtonProps {
  psalmId: string;
  inFavourite: boolean;
  transposition: number;
}

const InFavouriteIconButton = ({ psalmId, transposition }: InFavouriteIconButtonProps) => {
  const { favouriteBookId, favouritePsalmsDataMap } = usePsalmsData();
  const inFavourite = !!favouritePsalmsDataMap[psalmId];

  const [internalFavouriteState, setInternalFavouriteState] = useState(inFavourite);

  const { addPsalmToFavouriteMutation, removePsalmFromFavouriteMutation } = useAddRemoveFavourite({
    favouriteBookId,
    psalmId,
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
  }, [internalFavouriteState]);

  const handleFavouriteIconClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    setInternalFavouriteState((prevState) => !prevState);
  };

  return (
    <StyledIconButton size="small" onClick={handleFavouriteIconClick}>
      {internalFavouriteState ? <TurnedInIcon /> : <TurnedInNotIcon />}
    </StyledIconButton>
  );
};

export default InFavouriteIconButton;
