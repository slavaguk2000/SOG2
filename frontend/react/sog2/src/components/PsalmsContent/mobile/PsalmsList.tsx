import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';

import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';

import { usePsalmsData } from '../../../providers/dataProviders/psalmsDataProvider';
import InFavouriteIconButton from '../common/InFavouriteIconButton';

import { PsalmsListWrapper } from './styled';

const PsalmsList = () => {
  const { psalmsData, favouritePsalmsDataMap } = usePsalmsData();
  const [height, setHeight] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const debouncedSetHeight = useDebouncedCallback((newHeight: number) => {
    setHeight(newHeight);
  }, 5000);

  useEffect(() => {
    const clientHeight = ref?.current?.clientHeight;
    if (clientHeight) {
      if (height) {
        debouncedSetHeight(clientHeight);
      } else {
        setHeight(clientHeight);
      }
    }
  }, [debouncedSetHeight, ref]);

  return (
    <PsalmsListWrapper ref={ref}>
      {psalmsData && height && (
        <FixedSizeList height={height} width={700} itemSize={46} itemCount={psalmsData.length} overscanCount={5}>
          {({ index, style }) => {
            const currentPsalm = psalmsData[index];
            const inFavourite = !!favouritePsalmsDataMap?.[currentPsalm.id];

            return (
              <ListItem
                sx={{ background: inFavourite ? '#0253' : undefined, height: '100%', width: '100%' }}
                disablePadding
                key={currentPsalm.id}
                style={style}
                secondaryAction={
                  <InFavouriteIconButton
                    psalmId={currentPsalm.id}
                    inFavourite={inFavourite}
                    transposition={currentPsalm.transposition}
                  />
                }
              >
                <ListItemButton sx={{ height: '100%', width: '100%' }}>
                  <ListItemText primary={`${currentPsalm.psalmNumber} ${currentPsalm.name}`} />
                </ListItemButton>
              </ListItem>
            );
          }}
        </FixedSizeList>
      )}
    </PsalmsListWrapper>
  );
};

export default PsalmsList;
