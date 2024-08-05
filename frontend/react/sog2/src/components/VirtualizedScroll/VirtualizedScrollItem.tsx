import React, { CSSProperties, useEffect, useRef } from 'react';

import { Box, ListItem } from '@mui/material';

import { useItemsData } from './Providers/ItemsDataProvider';

interface VirtualizedScrollItemProps {
  index: number;
  style: CSSProperties;
  setSize: (index: number, size: number) => void;
  parentClientWidth: number | null;
}

const VirtualizedScrollItem = ({ index, style, setSize, parentClientWidth }: VirtualizedScrollItemProps) => {
  const rowRef = useRef<HTMLDivElement>();

  const { getItem } = useItemsData();

  useEffect(() => {
    if (rowRef.current) {
      setSize(index, rowRef.current.getBoundingClientRect().height);
    }
  }, [setSize, index, parentClientWidth]);

  return (
    <ListItem disablePadding style={style}>
      <Box ref={rowRef} width="100%">
        {getItem(index)}
      </Box>
    </ListItem>
  );
};

export default VirtualizedScrollItem;
