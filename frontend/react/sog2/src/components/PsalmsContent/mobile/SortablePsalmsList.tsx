import React from 'react';

import ReorderIcon from '@mui/icons-material/Reorder';
import { Box } from '@mui/material';
import { Reorder, useDragControls } from 'framer-motion';

import useReorder from '../../../hooks/useReorder';
import { useCurrentPsalms } from '../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import { usePsalms } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';
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
              overflow="hidden"
              width={currentPsalm ? 0 : undefined}
              sx={{ touchAction: 'none', transition: 'all 0.1s ease-out' }}
              pl={currentPsalm ? 0 : '15px'}
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

const SortablePsalmsList = () => {
  const { psalmsData, handlePsalmsReorder } = usePsalms();

  const { orderableData, onReorder } = useReorder({
    backendData: psalmsData ?? [],
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

export default SortablePsalmsList;
