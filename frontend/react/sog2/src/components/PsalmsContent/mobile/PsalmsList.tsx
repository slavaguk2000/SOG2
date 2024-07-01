import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';

import { usePsalmsData } from '../../../providers/dataProviders/psalmsDataProvider';
import InFavouriteIconButton from '../common/InFavouriteIconButton';

import { PsalmsListWrapper } from './styled';

const PsalmsList = () => {
  const { psalmsData } = usePsalmsData();
  const [checked, setChecked] = useState<string[]>([]);
  const [height, setHeight] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const debouncedSetHeight = useDebouncedCallback((newHeight: number) => {
    setHeight(newHeight);
  }, 5000);

  useEffect(() => {
    if (ref?.current?.clientHeight) {
      debouncedSetHeight(ref.current.clientHeight);
    }
  }, [debouncedSetHeight, ref]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // TODO : fix click animation
  // https://mui.com/material-ui/react-list/#virtualized-list
  // https://github.com/bvaughn/react-virtualized/issues/657#issuecomment-381518076
  const renderRow = ({ index, style }: ListChildComponentProps) => {
    if (!psalmsData) return null;

    const currentPsalm = psalmsData[index];

    return (
      <ListItem
        sx={{ background: currentPsalm.inFavourite ? '#0253' : undefined }}
        style={style}
        key={currentPsalm.id}
        secondaryAction={
          <IconButton edge="end">
            <InFavouriteIconButton
              psalmId={currentPsalm.id}
              inFavourite={currentPsalm.inFavourite}
              transposition={currentPsalm.transposition}
            />
          </IconButton>
        }
        disablePadding
      >
        <ListItemButton role={undefined} onClick={handleToggle(currentPsalm.id)} dense>
          <ListItemText primary={`${currentPsalm.psalmNumber} ${currentPsalm.name}`} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <PsalmsListWrapper ref={ref}>
      {psalmsData && height && (
        <FixedSizeList height={height} width={700} itemSize={46} itemCount={psalmsData.length} overscanCount={5}>
          {renderRow}
        </FixedSizeList>
      )}
    </PsalmsListWrapper>
  );
};

export default PsalmsList;
