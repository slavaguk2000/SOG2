import React, { useState, MouseEvent } from 'react';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import useAdaptiveFontSize from '../../../../hooks/useAdaptiveFontSize';
import { useCurrentPsalms } from '../../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import PsalmCoupletView from '../../../psalmChords/PsalmCoupletView';
import PsalmTitle from '../../common/PsalmTitle';

import { PsalmViewDrawerBodyWrapper } from './styled';

const maxFontSize = 20;

const PsalmViewDrawerBody = () => {
  const { psalmData, currentPsalm } = useCurrentPsalms();
  const [selectedCouplet, setSelectedCouplet] = useState<string | undefined>();

  const handleChange = (e: MouseEvent<HTMLElement>, value: string) => {
    e.preventDefault();
    setSelectedCouplet(value);
  };

  const { viewRef, fontSize } = useAdaptiveFontSize({
    maxFontSize,
    deps: [currentPsalm, psalmData],
  });

  return (
    <PsalmViewDrawerBodyWrapper ref={viewRef}>
      {currentPsalm && <PsalmTitle psalm={currentPsalm} fontSize={fontSize * 0.9} />}

      <ToggleButtonGroup fullWidth orientation="vertical" exclusive value={selectedCouplet} onChange={handleChange}>
        {psalmData?.couplets.map(({ id, couplet: { coupletContent, marker, styling } }) => (
          <ToggleButton key={id} value={id}>
            <PsalmCoupletView
              coupletContent={coupletContent}
              fontSize={fontSize}
              coupletMarker={marker}
              styling={styling}
              splitByLines
            />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </PsalmViewDrawerBodyWrapper>
  );
};

export default PsalmViewDrawerBody;
