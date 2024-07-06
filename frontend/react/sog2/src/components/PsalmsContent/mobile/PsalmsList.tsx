import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';

import { useDebouncedCallback } from 'use-debounce';

import PsalmsListItem from './PsalmsListItem';
import { PsalmsListWrapper } from './styled';

interface PsalmsListProps {
  listSize: number;
}

const PsalmsList = ({ listSize }: PsalmsListProps) => {
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
  }, [debouncedSetHeight, ref, height]);

  return (
    <PsalmsListWrapper ref={ref}>
      {!!(listSize && height) && (
        <FixedSizeList height={height} width={700} itemSize={46} itemCount={listSize} overscanCount={5}>
          {({ index, style }) => <PsalmsListItem key={index} style={style} index={index} />}
        </FixedSizeList>
      )}
    </PsalmsListWrapper>
  );
};

export default PsalmsList;
