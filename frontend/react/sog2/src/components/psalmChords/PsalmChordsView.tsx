import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Typography } from '@mui/material';

import { PsalmData } from '../../utils/gql/types';

import { useEditableChordsData } from './editableChordsDataProvider';
import PsalmChordsViewContent from './PsalmChordsViewContent';
import { PsalmChordsViewTitleWrapper, PsalmChordsViewWrapper } from './styled';
import { keyToScaleDegree } from './utils';

export interface PsalmChordsViewProps {
  data?: PsalmData;
}

const maxFontSize = 35;

const PsalmChordsView = ({ data }: PsalmChordsViewProps) => {
  const viewRef = useRef<null | HTMLDivElement>(null);
  const { psalmData } = useEditableChordsData();

  const currentData = data ?? psalmData;

  const mainKey = currentData ? keyToScaleDegree[currentData.psalm.defaultTonality as string] : 0;
  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    if (viewRef.current && viewRef.current.clientHeight < viewRef.current.scrollHeight) {
      setFontSize(fontSize - 1);
    }
  }, [fontSize, currentData]);

  useEffect(() => {
    setFontSize(maxFontSize);
  }, [currentData]);

  if (!currentData) {
    return null;
  }

  return (
    <PsalmChordsViewWrapper ref={viewRef}>
      <PsalmChordsViewTitleWrapper>
        <Typography
          fontWeight="bold"
          fontSize={fontSize * 0.9}
          variant="h4"
        >{`${currentData.psalm.psalmNumber} ${currentData.psalm.name}`}</Typography>
      </PsalmChordsViewTitleWrapper>

      <PsalmChordsViewContent fontSize={fontSize} mainKey={mainKey} />
    </PsalmChordsViewWrapper>
  );
};

export default PsalmChordsView;
