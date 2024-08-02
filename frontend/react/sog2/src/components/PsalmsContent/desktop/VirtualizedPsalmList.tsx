import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';

import { Box } from '@mui/material';
import ResizeObserver from 'resize-observer-polyfill';
import { useDebouncedCallback } from 'use-debounce';

import { useCurrentPsalms } from '../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import { useFavouriteData } from '../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { usePsalms } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';
import ScrollerToSelectedPsalm from '../mobile/ScrollerToSelectedPsalm';

import PsalmSelectItem from './PsalmSelectItem';
import { StyledListItem } from './styled';

const itemSize = 46;

interface PsalmsListItemProps {
  index: number;
  style: CSSProperties;
}

const PsalmsListItem = ({ index, style }: PsalmsListItemProps) => {
  const { psalmsData } = usePsalms();
  const { handlePsalmSelect, currentPsalm: selectedPsalm } = useCurrentPsalms();
  const { favouritePsalmsDataMap } = useFavouriteData();

  const currentPsalm = psalmsData?.[index];

  const inFavourite = !!(currentPsalm && favouritePsalmsDataMap[currentPsalm?.id]);

  return currentPsalm ? (
    <StyledListItem disablePadding style={style}>
      <PsalmSelectItem
        psalmName={currentPsalm.name}
        selected={currentPsalm.id === selectedPsalm?.id}
        onClick={() => handlePsalmSelect(currentPsalm.id)}
        psalmId={currentPsalm.id}
        transposition={currentPsalm.transposition}
        inFavourite={inFavourite}
        sx={{ margin: '-5px 0' }}
      />
    </StyledListItem>
  ) : null;
};

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
    <Box height={'100%'} ref={ref}>
      {!!(dataLength && height) && (
        <>
          {ref?.current && <ScrollerToSelectedPsalm containerParentRef={ref.current} itemSize={itemSize} />}
          <FixedSizeList height={height} width={'25vw'} itemSize={itemSize} itemCount={dataLength} overscanCount={5}>
            {({ index, style }) => <PsalmsListItem key={index} style={style} index={index} />}
          </FixedSizeList>
        </>
      )}
    </Box>
  );
};

export default VirtualizedPsalmList;
