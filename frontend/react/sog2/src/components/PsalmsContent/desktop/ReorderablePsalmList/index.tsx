import React, { useEffect, useMemo } from 'react';

import { Reorder } from 'framer-motion';

import useReorder from '../../../../hooks/useReorder';
import { useFavouriteData } from '../../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { usePsalmsBooksData } from '../../../../providers/dataProviders/psalmsDataProvider/PsalmsBooksProvider';
import { usePsalms } from '../../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';

import ListItem, { PsalmSelectItemType } from './ListItem';

const ReorderablePsalmList = () => {
  const { psalmsData } = usePsalms();
  const { handlePsalmsReorder, favouritePsalmsData, favouriteReady } = useFavouriteData();
  const { currentPsalmBook, selectPsalmBookWithPsalms } = usePsalmsBooksData();

  const isCurrentBookFavourite = !!currentPsalmBook?.isFavourite;

  useEffect(() => {
    if (isCurrentBookFavourite && favouriteReady && !favouritePsalmsData.length) {
      selectPsalmBookWithPsalms();
    }
  });

  const preparedData = useMemo(
    () =>
      (isCurrentBookFavourite ? favouritePsalmsData : psalmsData)?.map(
        ({ id, name, psalmNumber, defaultTonality, tonality, transposition }) => {
          return {
            id,
            name: `${psalmNumber ? `${psalmNumber} ` : ''}${name}${defaultTonality ? ` (${tonality})` : ''}`,
            defaultTonality,
            transposition,
          };
        },
      ),
    [psalmsData, favouritePsalmsData, isCurrentBookFavourite],
  );

  const { orderableData, onReorder } = useReorder<PsalmSelectItemType>({
    backendData: preparedData ?? [],
    updateBackend: (items) => handlePsalmsReorder(items.map(({ id }) => id)),
  });

  return (
    <Reorder.Group axis="y" values={orderableData} onReorder={onReorder}>
      {orderableData.map((item) => (
        <Reorder.Item key={item.id} value={item}>
          <ListItem key={item.id} {...item} />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};

export default ReorderablePsalmList;
