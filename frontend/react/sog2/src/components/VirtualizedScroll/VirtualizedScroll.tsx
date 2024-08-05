import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { VariableSizeList } from 'react-window';

import { Box } from '@mui/material';
import ResizeObserver from 'resize-observer-polyfill';
import { useDebouncedCallback } from 'use-debounce';

import { useItemsDataLength } from './Providers/DataLengthProvider';
import ScrollerToSelectedItem from './ScrollerToSelected';
import VirtualizedScrollItem from './VirtualizedScrollItem';

const VirtualizedScroll = () => {
  const [height, setHeight] = useState<number | null>(null);
  const [clientWidth, setClientWidth] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const { dataLength, minimumItemSize, width } = useItemsDataLength();

  const debouncedSetHeight = useDebouncedCallback((newHeight: number) => {
    setHeight(newHeight);
  }, 100);

  const listRef = useRef<VariableSizeList>(null);
  const sizeMap = useRef<Record<number, number>>({});

  const setSize = useCallback((index: number, size: number) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current?.resetAfterIndex(index);
  }, []);

  const getSize = (index: number) => {
    return sizeMap.current[index] || minimumItemSize;
  };

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const clientHeight = entry.target.clientHeight;
        const clientWidth = entry.target.clientWidth;
        if (clientHeight) {
          if (height) {
            debouncedSetHeight(clientHeight);
          } else {
            setHeight(clientHeight);
          }
        }
        if (clientWidth) {
          setClientWidth(clientWidth);
        }
      }
    });

    const element = ref.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [debouncedSetHeight, height]);

  return (
    <Box overflow="hidden" height={'100%'} ref={ref}>
      {!!(dataLength && height) && (
        <>
          <ScrollerToSelectedItem listRef={listRef} />
          <VariableSizeList
            ref={listRef as RefObject<VariableSizeList>}
            height={height}
            width={width}
            itemCount={dataLength}
            overscanCount={5}
            itemSize={getSize}
          >
            {({ index, style }) => (
              <VirtualizedScrollItem
                key={index}
                style={style}
                index={index}
                setSize={setSize}
                parentClientWidth={clientWidth}
              />
            )}
          </VariableSizeList>
        </>
      )}
    </Box>
  );
};

export default VirtualizedScroll;
