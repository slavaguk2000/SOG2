import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Typography } from '@mui/material';

import { PsalmData } from '../../utils/gql/types';

import PsalmCoupletView from './PsalmCoupletView';
import { PsalmChordsViewContentWrapper, PsalmChordsViewTitleWrapper, PsalmChordsViewWrapper } from './styled';
import { keyToScaleDegree } from './utils';

interface PsalmChordsViewProps {
  data: PsalmData;
}

const maxFontSize = 35;

const PsalmChordsView = ({ data }: PsalmChordsViewProps) => {
  const viewRef = useRef<null | HTMLDivElement>(null);
  const mainKey = keyToScaleDegree[data.psalm.defaultTonality as string];
  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    if (viewRef.current && viewRef.current.clientHeight < viewRef.current.scrollHeight) {
      setFontSize(fontSize - 1);
    }
  }, [fontSize]);

  useEffect(() => {
    setFontSize(maxFontSize);
  }, [data]);

  return (
    <PsalmChordsViewWrapper ref={viewRef}>
      <PsalmChordsViewTitleWrapper>
        <Typography
          fontWeight="bold"
          fontSize={fontSize * 0.9}
          variant="h4"
        >{`${data.psalm.psalmNumber} ${data.psalm.name}`}</Typography>
      </PsalmChordsViewTitleWrapper>

      <PsalmChordsViewContentWrapper>
        {data.couplets.map(({ coupletContent, id }) => (
          <PsalmCoupletView
            key={id}
            coupletContent={coupletContent ?? []}
            fontSize={fontSize}
            mainKey={mainKey}
            splitByLines
          />
        ))}
      </PsalmChordsViewContentWrapper>
    </PsalmChordsViewWrapper>
  );
};

export default PsalmChordsView;
