import React from 'react';

import { Box } from '@mui/material';

import useAdaptiveFontSize from '../../hooks/useAdaptiveFontSize';
import { PsalmData } from '../../utils/gql/types';
import PsalmTitle from '../PsalmsContent/common/PsalmTitle';

import { useEditableChordsData } from './editableChordsDataProvider';
import PsalmChordsViewContent from './PsalmChordsViewContent';
import { PsalmChordsViewTitleWrapper, PsalmChordsViewWrapper } from './styled';

export interface PsalmChordsViewProps {
  data?: PsalmData;
  editing?: boolean;
}

const maxFontSize = 35;

const PsalmChordsView = ({ data, editing }: PsalmChordsViewProps) => {
  const { mainKey, psalmData } = useEditableChordsData();

  const currentData = data ?? psalmData;

  const { viewRef, fontSize } = useAdaptiveFontSize({
    maxFontSize,
    deps: [currentData],
  });

  if (!currentData) {
    return null;
  }

  return (
    <PsalmChordsViewWrapper ref={viewRef}>
      <Box>
        <PsalmChordsViewTitleWrapper>
          <PsalmTitle
            fontSize={fontSize * 0.9}
            psalm={currentData.psalm}
            typographyProps={{
              variant: 'h4',
            }}
          />
        </PsalmChordsViewTitleWrapper>

        <PsalmChordsViewContent editing={editing} fontSize={fontSize} mainKey={mainKey} />
      </Box>
    </PsalmChordsViewWrapper>
  );
};

export default PsalmChordsView;
