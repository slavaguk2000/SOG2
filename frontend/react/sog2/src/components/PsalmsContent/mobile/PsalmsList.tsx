import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';

import { useDebouncedCallback } from 'use-debounce';

import { usePsalms } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';

import PsalmsListItem from './PsalmsListItem';
import ScrollerToSelectedPsalm from './ScrollerToSelectedPsalm';
import { PsalmsListWrapper } from './styled';

const itemSize = 46;

const PsalmsList = () => {
  const [height, setHeight] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const { dataLength } = usePsalms();

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
      {!!(dataLength && height) && (
        <>
          {ref?.current && <ScrollerToSelectedPsalm containerParentRef={ref.current} itemSize={itemSize} />}
          <FixedSizeList height={height} width={700} itemSize={itemSize} itemCount={dataLength} overscanCount={5}>
            {({ index, style }) => <PsalmsListItem key={index} style={style} index={index} />}
          </FixedSizeList>
        </>
      )}
    </PsalmsListWrapper>
  );
};

export default PsalmsList;
