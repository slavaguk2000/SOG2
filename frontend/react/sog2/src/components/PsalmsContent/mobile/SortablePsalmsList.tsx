import React from 'react';

import ReorderIcon from '@mui/icons-material/Reorder';
import { Box } from '@mui/material';
import { Reorder, useDragControls } from 'framer-motion';

import useReorder from '../../../hooks/useReorder';
import { usePsalms } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';

import PsalmItem from './PsalmItem';
import { SortablePsalmsListWrapper, StyledSortableListItem } from './styled';

const SortablePsalmsList = () => {
  const { psalmsData, handlePsalmsReorder } = usePsalms();

  const { orderableData, onReorder } = useReorder({
    backendData: psalmsData ?? [],
    updateBackend: (items) => handlePsalmsReorder(items.map(({ id }) => id)),
  });

  const controls = useDragControls();

  return (
    <SortablePsalmsListWrapper>
      <Reorder.Group axis="y" values={orderableData} onReorder={onReorder} layoutScroll style={{ overflowY: 'scroll' }}>
        {orderableData.map((item) => (
          <Reorder.Item key={item.id} value={item} dragListener={false} dragControls={controls}>
            <StyledSortableListItem disablePadding>
              <PsalmItem
                psalmNumber={item.psalmNumber}
                inFavourite
                psalmId={item.id}
                transposition={item.transposition}
                name={item.name}
                reorderIcon={
                  <Box pl="15px" className="reorder-handle" onPointerDown={(e) => controls.start(e)}>
                    <ReorderIcon />
                  </Box>
                }
              />
            </StyledSortableListItem>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </SortablePsalmsListWrapper>
  );
};

export default SortablePsalmsList;
