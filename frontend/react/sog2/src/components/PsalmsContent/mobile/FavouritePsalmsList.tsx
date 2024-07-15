import React from 'react';

import ReorderIcon from '@mui/icons-material/Reorder';
import { Box } from '@mui/material';
import { Reorder, useDragControls } from 'framer-motion';

import useReorder from '../../../hooks/useReorder';
import { useCurrentPsalms } from '../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import { useFavouriteData } from '../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { PsalmData } from '../../../providers/types';

import PsalmItem from './PsalmItem';
import { SortablePsalmsListWrapper } from './styled';

interface ReorderItemProps {
  item: PsalmData;
}

const ReorderItem = ({ item }: ReorderItemProps) => {
  const dragControls = useDragControls();
  const { currentPsalm } = useCurrentPsalms();

  return (
    <Reorder.Item value={item} dragListener={false} dragControls={dragControls}>
      <Box height="46px">
        <PsalmItem
          psalmNumber={item.psalmNumber}
          inFavourite
          psalmId={item.id}
          transposition={item.transposition}
          name={item.name}
          reorderIcon={
            <Box
              height="100%"
              display="flex"
              alignItems="center"
              position="absolute"
              sx={{ touchAction: 'none', transition: 'all 0.2s ease-out', left: currentPsalm ? '-40px' : 0 }}
              pl="15px"
              className="reorder-handle"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <ReorderIcon />
            </Box>
          }
        />
      </Box>
    </Reorder.Item>
  );
};

const FavouritePsalmsList = () => {
  const { favouritePsalmsData, handlePsalmsReorder } = useFavouriteData();

  const { orderableData, onReorder } = useReorder({
    backendData: favouritePsalmsData,
    updateBackend: (items) => handlePsalmsReorder(items.map(({ id }) => id)),
  });

  return (
    <SortablePsalmsListWrapper>
      <Reorder.Group axis="y" values={orderableData} onReorder={onReorder} layoutScroll style={{ overflowY: 'scroll' }}>
        {orderableData.map((item) => (
          <ReorderItem key={item.id} item={item} />
        ))}
      </Reorder.Group>
    </SortablePsalmsListWrapper>
  );
};

export default FavouritePsalmsList;
