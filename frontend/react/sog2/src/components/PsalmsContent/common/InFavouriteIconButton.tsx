import React, { MouseEventHandler, useState } from 'react';

import TurnedInIcon from '@mui/icons-material/TurnedIn';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';

import useAddRemoveFavourite from '../../../hooks/useAddRemoveFavourite';
import { usePsalmsData } from '../../../providers/dataProviders/psalmsDataProvider';
import { StyledIconButton } from '../desktop/styled';

export interface InFavouriteIconButtonProps {
  psalmId: string;
  inFavourite?: boolean;
  transposition: number;
}

const InFavouriteIconButton = ({ inFavourite, psalmId, transposition }: InFavouriteIconButtonProps) => {
  const [internalFavouriteState, setInternalFavouriteState] = useState(inFavourite);

  const { favouriteBookId } = usePsalmsData();

  const { addPsalmToFavouriteMutation, removePsalmFromFavouriteMutation } = useAddRemoveFavourite({
    favouriteBookId,
    psalmId,
    transposition,
  });

  const handleFavouriteIconClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    setInternalFavouriteState((prevState) => {
      if (prevState) {
        removePsalmFromFavouriteMutation().catch(() => setInternalFavouriteState(inFavourite));
        return false;
      } else {
        addPsalmToFavouriteMutation().catch(() => setInternalFavouriteState(inFavourite));
        return true;
      }
    });
  };

  return (
    <StyledIconButton size="small" onClick={handleFavouriteIconClick}>
      {internalFavouriteState ? <TurnedInIcon /> : <TurnedInNotIcon />}
    </StyledIconButton>
  );
};

export default InFavouriteIconButton;
