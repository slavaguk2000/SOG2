import React from 'react';

import { useFavouriteData } from '../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import BibleEntityItem from '../../BibleContent/BibleEntityItem';
import FavouriteIconButton, { FavouriteIconButtonProps } from '../common/InFavouriteIconButton';

interface PsalmSelectItemProps extends FavouriteIconButtonProps {
  psalmName: string;
  selected: boolean;
  onClick: () => void;
}

const PsalmSelectItem = ({ psalmName, selected, onClick, ...favouriteIconButtonProps }: PsalmSelectItemProps) => {
  const { favouriteReady } = useFavouriteData();

  return (
    <BibleEntityItem fixedTwoLines name={psalmName} onClick={onClick} selected={selected} scrollingOrder={1}>
      {favouriteReady && <FavouriteIconButton {...favouriteIconButtonProps} />}
    </BibleEntityItem>
  );
};

export default PsalmSelectItem;
