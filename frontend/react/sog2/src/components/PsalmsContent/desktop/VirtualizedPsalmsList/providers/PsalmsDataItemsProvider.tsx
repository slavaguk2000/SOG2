import React, { PropsWithChildren, useCallback, useMemo } from 'react';

import { Box } from '@mui/material';

import { useCurrentPsalms } from '../../../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import { useFavouriteData } from '../../../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { usePsalms } from '../../../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';
import ItemsDataProvider from '../../../../VirtualizedScroll/Providers/ItemsDataProvider';
import { usePsalmsContextMenu } from '../../PsalmsContextMenuProvider';
import PsalmSelectItem from '../../PsalmSelectItem';

const PsalmsDataItemsProvider = ({ children }: PropsWithChildren) => {
  const { psalmsData } = usePsalms();
  const { handlePsalmSelect, currentPsalm: selectedPsalm } = useCurrentPsalms();
  const { favouritePsalmsDataMap } = useFavouriteData();
  const { handleContextMenu } = usePsalmsContextMenu();

  const selected = useMemo(
    () => selectedPsalm && psalmsData?.findIndex(({ id }) => id === selectedPsalm.id),
    [psalmsData, selectedPsalm],
  );

  const getItem = useCallback(
    (index: number) => {
      const currentPsalm = psalmsData?.[index];

      const inFavourite = !!(currentPsalm && favouritePsalmsDataMap[currentPsalm?.id]);

      return currentPsalm ? (
        <Box width="100%" onContextMenu={(e) => handleContextMenu(e, currentPsalm.id, currentPsalm.defaultTonality)}>
          <PsalmSelectItem
            psalmName={`${currentPsalm.psalmNumber ? `${currentPsalm.psalmNumber} ` : ''}${currentPsalm.name}`}
            selected={currentPsalm.id === selectedPsalm?.id}
            onClick={() => handlePsalmSelect(currentPsalm.id)}
            psalmId={currentPsalm.id}
            transposition={currentPsalm.transposition}
            inFavourite={inFavourite}
            sx={{ margin: '-5px 0' }}
          />
        </Box>
      ) : null;
    },
    [favouritePsalmsDataMap, handleContextMenu, handlePsalmSelect, psalmsData, selectedPsalm?.id],
  );

  return (
    <ItemsDataProvider getItem={getItem} selected={selected}>
      {children}
    </ItemsDataProvider>
  );
};

export default PsalmsDataItemsProvider;
