import React from 'react';

import useAdaptiveFontSize from '../../hooks/useAdaptiveFontSize';
import { PsalmData } from '../../utils/gql/types';
import PsalmTitle from '../PsalmsContent/common/PsalmTitle';

import { useEditableChordsData } from './editableChordsDataProvider';
import PsalmChordsViewContent from './PsalmChordsViewContent';
import { PsalmChordsViewTitleWrapper, PsalmChordsViewWrapper } from './styled';

export interface PsalmChordsViewProps {
  data?: PsalmData;
}

const maxFontSize = 35;

const PsalmChordsView = ({ data }: PsalmChordsViewProps) => {
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
      <PsalmChordsViewTitleWrapper>
        <PsalmTitle
          fontSize={fontSize * 0.9}
          psalm={currentData.psalm}
          typographyProps={{
            variant: 'h4',
          }}
        />
      </PsalmChordsViewTitleWrapper>

      <PsalmChordsViewContent fontSize={fontSize} mainKey={mainKey} />
    </PsalmChordsViewWrapper>
  );
};

export default PsalmChordsView;
