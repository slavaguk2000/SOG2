import React from 'react';
import { useLocation } from 'react-router-dom';

import { Box } from '@mui/material';

import FavouriteIconButton from '../PsalmsContent/common/InFavouriteIconButton';

interface SearchLineFavouriteProps {
  location: string[];
}

const SearchLineFavourite = ({ location }: SearchLineFavouriteProps) => {
  const { pathname } = useLocation();

  const [locationPsalmsBookId, locationPsalmId] = location;

  const isPsalms = pathname === '/psalms';

  return isPsalms ? (
    <Box display="flex">
      <Box height="34px">
        <FavouriteIconButton psalmId={locationPsalmId} psalmsBookId={locationPsalmsBookId} />
      </Box>
    </Box>
  ) : null;
};

export default SearchLineFavourite;
