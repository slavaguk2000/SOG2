import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';

import { Box } from '@mui/material';
import ResizeObserver from 'resize-observer-polyfill';
import { useDebouncedCallback } from 'use-debounce';

import { usePsalms } from '../../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';
import ScrollerToSelectedPsalm from '../../mobile/ScrollerToSelectedPsalm';

import PsalmsListItem from './ListItem';

const itemSize = 46;

const VirtualizedPsalmList = () => {
  const [height, setHeight] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const { dataLength } = usePsalms();

  const debouncedSetHeight = useDebouncedCallback((newHeight: number) => {
    setHeight(newHeight);
  }, 1000);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const clientHeight = entry.target.clientHeight;
        if (clientHeight) {
          if (height) {
            debouncedSetHeight(clientHeight);
          } else {
            setHeight(clientHeight);
          }
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
          {ref?.current && <ScrollerToSelectedPsalm containerParentRef={ref.current} itemSize={itemSize} />}
          <FixedSizeList height={height} width={'20vw'} itemSize={itemSize} itemCount={dataLength} overscanCount={5}>
            {({ index, style }) => <PsalmsListItem key={index} style={style} index={index} />}
          </FixedSizeList>
        </>
      )}
    </Box>
  );
};

export default VirtualizedPsalmList;
