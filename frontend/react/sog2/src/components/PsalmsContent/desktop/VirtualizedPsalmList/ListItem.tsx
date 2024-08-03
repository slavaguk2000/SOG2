import React, { CSSProperties } from 'react';

import { useCurrentPsalms } from '../../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import { useFavouriteData } from '../../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { usePsalms } from '../../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';
import { usePsalmsContextMenu } from '../PsalmsContextMenuProvider';
import PsalmSelectItem from '../PsalmSelectItem';
import { StyledListItem } from '../styled';

interface PsalmsListItemProps {
  index: number;
  style: CSSProperties;
}

const PsalmsListItem = ({ index, style }: PsalmsListItemProps) => {
  const { psalmsData } = usePsalms();
  const { handlePsalmSelect, currentPsalm: selectedPsalm } = useCurrentPsalms();
  const { favouritePsalmsDataMap } = useFavouriteData();
  const { handleContextMenu } = usePsalmsContextMenu();

  const currentPsalm = psalmsData?.[index];

  const inFavourite = !!(currentPsalm && favouritePsalmsDataMap[currentPsalm?.id]);

  return currentPsalm ? (
    <StyledListItem
      disablePadding
      style={style}
      onContextMenu={(e) => handleContextMenu(e, currentPsalm.id, currentPsalm.defaultTonality)}
    >
      <PsalmSelectItem
        psalmName={`${currentPsalm.psalmNumber ? `${currentPsalm.psalmNumber} ` : ''}${currentPsalm.name}`}
        selected={currentPsalm.id === selectedPsalm?.id}
        onClick={() => handlePsalmSelect(currentPsalm.id)}
        psalmId={currentPsalm.id}
        transposition={currentPsalm.transposition}
        inFavourite={inFavourite}
        sx={{ margin: '-5px 0' }}
      />
    </StyledListItem>
  ) : null;
};

export default PsalmsListItem;
