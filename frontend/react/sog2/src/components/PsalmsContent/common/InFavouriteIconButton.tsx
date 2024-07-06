import React, { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from 'react';

import TurnedInIcon from '@mui/icons-material/TurnedIn';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import { useDebouncedCallback } from 'use-debounce';

import useAddRemoveFavourite from '../../../hooks/useAddRemoveFavourite';
import { usePsalmsData } from '../../../providers/dataProviders/psalmsDataProvider';
import { StyledIconButton } from '../desktop/styled';

export interface InFavouriteIconButtonProps {
  psalmId: string;
  inFavourite?: boolean;
  transposition: number;
  value?: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
}

const InFavouriteIconButton = ({ psalmId, transposition, value, onChange }: InFavouriteIconButtonProps) => {
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

  const justInternal = value === undefined;

  const handleFavouriteIconClick: MouseEventHandler = (e) => {
    e.stopPropagation();
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

  return (
    <StyledIconButton size="small" onClick={handleFavouriteIconClick}>
      {currentState ? <TurnedInIcon /> : <TurnedInNotIcon />}
    </StyledIconButton>
  );
};

export default InFavouriteIconButton;
