import React from 'react';

import { Typography } from '@mui/material';

import PsalmsBookAvatar from '../../common/PsalmsBookAvatar';
import { BottomNavigationItemWrapper } from '../styled';

interface BottomNavigationItemProps {
  name: string;
  iconSrc?: string;
  isFavourite: boolean;
}

const BottomNavigationItem = ({ name, iconSrc, isFavourite }: BottomNavigationItemProps) => {
  return (
    <BottomNavigationItemWrapper>
      {<Typography noWrap>{isFavourite ? 'Favourite' : name}</Typography>}
      <PsalmsBookAvatar name={name} isFavourite={isFavourite} iconSrc={iconSrc} />
    </BottomNavigationItemWrapper>
  );
};

export default BottomNavigationItem;
