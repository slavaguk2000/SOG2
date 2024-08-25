import React, { useMemo } from 'react';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Avatar from '@mui/material/Avatar';

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

interface PsalmsBookAvatarProps {
  name: string;
  iconSrc?: string;
  isFavourite: boolean;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
}

const PsalmsBookAvatar = ({ name, isFavourite, iconSrc, onContextMenu }: PsalmsBookAvatarProps) => {
  const initials = useMemo(() => {
    if (!name) return '';
    const nameArray = name.split(' ');
    const initials = nameArray.map((word) => word.charAt(0)).join('');
    return initials.toUpperCase();
  }, [name]);

  return (
    <Avatar {...avatarBGProps((!isFavourite && name) || undefined)} src={iconSrc} onContextMenu={onContextMenu}>
      {isFavourite ? <BookmarkBorderIcon /> : initials}
    </Avatar>
  );
};

export default PsalmsBookAvatar;
