import React, { useMemo } from 'react';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Collapse, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';

import { PsalmsBook } from '../../utils/gql/types';

import { PsalmBookItemWrapper } from './styled';

interface PsalmBookItemProps {
  psalmsBookData?: PsalmsBook;
  selected?: boolean;
  onClick?: () => void;
}

const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const avatarBGProps = (name?: string) => {
  return {
    sx: {
      background: `linear-gradient(0deg, #000707 0%, ${name ? stringToColor(name) : '#35dcde'} 100%)`,
    },
  };
};

const PsalmBookItem = ({ psalmsBookData, selected, onClick }: PsalmBookItemProps) => {
  const initials = useMemo(() => {
    if (!psalmsBookData?.name) return '';
    const nameArray = psalmsBookData.name.split(' ');
    const initials = nameArray.map((word) => word.charAt(0)).join('');
    return initials.toUpperCase();
  }, [psalmsBookData]);

  const favourite = psalmsBookData?.isFavourite;

  return (
    <Collapse timeout={1000} in={!!psalmsBookData?.psalmsCount}>
      <Tooltip placement="right" title={favourite ? 'Favourite' : psalmsBookData?.name ?? 'Unknown'}>
        <PsalmBookItemWrapper selected={selected} onClick={onClick}>
          <Avatar
            {...avatarBGProps((!favourite && psalmsBookData?.name) || undefined)}
            src={psalmsBookData?.iconSrc ?? undefined}
          >
            {favourite ? <BookmarkBorderIcon /> : initials}
          </Avatar>
        </PsalmBookItemWrapper>
      </Tooltip>
    </Collapse>
  );
};

export default PsalmBookItem;
