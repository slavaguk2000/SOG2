import React from 'react';

import BibleEntityItem from '../../BibleContent/BibleEntityItem';
import InFavouriteIconButton, { InFavouriteIconButtonProps } from '../common/InFavouriteIconButton';

interface PsalmSelectItemProps extends InFavouriteIconButtonProps {
  psalmName: string;
  selected: boolean;
  onClick: () => void;
}

const PsalmSelectItem = ({ psalmName, selected, onClick, ...inFavouriteIconButtonProps }: PsalmSelectItemProps) => {
  return (
    <BibleEntityItem name={psalmName} onClick={onClick} selected={selected} scrollingOrder={1}>
      <InFavouriteIconButton {...inFavouriteIconButtonProps} />
    </BibleEntityItem>
  );
};

export default PsalmSelectItem;
