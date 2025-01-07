import React from 'react';

import { Box } from '@mui/material';

import { useCurrentPsalms } from '../../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import { useFavouriteData } from '../../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { MusicalKey } from '../../../../utils/gql/types';
import { usePsalmsContextMenu } from '../PsalmsContextMenuProvider';
import PsalmSelectItem from '../PsalmSelectItem';

export interface PsalmSelectItemType {
  transposition: number;
  defaultTonality: MusicalKey | null | undefined;
  name: string;
  id: string;
}

const ListItem = ({ id, name, transposition, defaultTonality }: PsalmSelectItemType) => {
  const { favouritePsalmsDataMap } = useFavouriteData();
  const { currentPsalm, handlePsalmSelect } = useCurrentPsalms();
  const { handleContextMenu } = usePsalmsContextMenu();

  return (
    <Box
      // TODO : only for new
      // className={isCurrentBookFavourite ? 'animate__animated animate__backInUp' : ''}
      onContextMenu={(e) => handleContextMenu(e, id, defaultTonality, transposition)}
    >
      <PsalmSelectItem
        psalmName={name}
        selected={id === currentPsalm?.id}
        onClick={() => handlePsalmSelect(id)}
        psalmId={id}
        transposition={transposition}
        inFavourite={!!favouritePsalmsDataMap[id]}
        sx={{ margin: '-5px 0' }}
      />
    </Box>
  );
};

export default ListItem;
