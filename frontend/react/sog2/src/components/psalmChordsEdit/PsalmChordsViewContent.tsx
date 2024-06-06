import React from 'react';

import { useEditableChordsData } from './editableChordsDataProvider';
import PsalmCoupletView from './PsalmCoupletView';
import { PsalmChordsViewContentWrapper } from './styled';

interface PsalmChordsViewContent {
  fontSize: number;
  mainKey: number;
}

const PsalmChordsViewContent = ({ fontSize, mainKey }: PsalmChordsViewContent) => {
  const { handleCutToNextLine, handleRemoveChord, handleAddChord, chordsData } = useEditableChordsData();

  return (
    <PsalmChordsViewContentWrapper>
      {chordsData.couplets.map(({ coupletContent, id }) => (
        <PsalmCoupletView
          key={id}
          coupletContent={coupletContent ?? []}
          fontSize={fontSize}
          mainKey={mainKey}
          splitByLines
          onCut={(coupletContentId, charPosition) => handleCutToNextLine(id, coupletContentId, charPosition)}
          onRemoveChord={(coupletContentId) => handleRemoveChord(id, coupletContentId)}
          onAddChord={(coupletContentId, charPosition, chord) =>
            handleAddChord(id, coupletContentId, charPosition, chord)
          }
        />
      ))}
    </PsalmChordsViewContentWrapper>
  );
};

export default PsalmChordsViewContent;
