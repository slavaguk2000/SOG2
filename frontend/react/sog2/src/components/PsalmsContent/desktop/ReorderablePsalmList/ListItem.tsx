import React from 'react';

import { Box } from '@mui/material';

import useSelectIntent from '../../../../hooks/useSelectIntent';
import { useCurrentPsalms } from '../../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import { useFavouriteData } from '../../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { usePsalmsBooksData } from '../../../../providers/dataProviders/psalmsDataProvider/PsalmsBooksProvider';
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
  const { currentPsalmBook } = usePsalmsBooksData();
  const { softSelected, setSoftSelected } = useSelectIntent<string, number>({
    hardSelected: currentPsalm?.id,
    setHardSelected: handlePsalmSelect,
  });

  const isCurrentBookFavourite = !!currentPsalmBook?.isFavourite;

  return (
    <Box
      className={isCurrentBookFavourite ? 'animate__animated animate__backInUp' : ''}
      onContextMenu={(e) => handleContextMenu(e, id, defaultTonality)}
    >
      <PsalmSelectItem
        psalmName={name}
        selected={id === softSelected}
        onClick={() => setSoftSelected(id, transposition)}
        psalmId={id}
        transposition={transposition}
        inFavourite={!!favouritePsalmsDataMap[id]}
        sx={{ margin: '-5px 0' }}
      />
    </Box>
  );
};

export default ListItem;
