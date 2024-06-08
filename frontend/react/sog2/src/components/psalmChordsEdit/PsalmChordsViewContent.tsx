import React, { useEffect } from 'react';

import { getChordByLinkingChordData, isChordsEquals } from '../../utils/chordUtils';
import { CoupletContentChord } from '../../utils/gql/types';

import { useEditableChordsData } from './editableChordsDataProvider';
import { useChordsEditInstrumentsContext } from './instrumentsProvider';
import PsalmCoupletView from './PsalmCoupletView';
import { PsalmChordsViewContentWrapper } from './styled';

interface PsalmChordsViewContent {
  fontSize: number;
  mainKey: number;
}

const PsalmChordsViewContent = ({ fontSize, mainKey }: PsalmChordsViewContent) => {
  const { setLinkingChordData, linkingChordData } = useChordsEditInstrumentsContext();
  const { handleCutToNextLine, handleRemoveChord, handleAddChord, chordsData, handleLinkChords } =
    useEditableChordsData();

  const onLinkChord = (
    coupletId: string,
    coupletContentId: string,
    charPosition: number,
    chord: CoupletContentChord,
  ) => {
    handleLinkChords(coupletId, coupletContentId, charPosition, chord);

    setLinkingChordData((prev) => {
      if (!prev) {
        return prev;
      }

      let nextData = {
        ...prev,
      };

      do {
        nextData = {
          ...nextData,
          coupletContentIdx: nextData.coupletContentIdx + 1,
        };

        if (nextData.coupletContentIdx >= chordsData.couplets[nextData.coupletIdx]?.coupletContent.length ?? 0) {
          nextData.coupletIdx++;
          nextData.coupletContentIdx = 0;

          if (nextData.coupletIdx >= chordsData.couplets.length) {
            return null;
          }
        }
      } while (
        isChordsEquals(getChordByLinkingChordData(chordsData, prev), getChordByLinkingChordData(chordsData, nextData))
      );

      return nextData;
    });
  };

  useEffect(() => {
    if (linkingChordData && !getChordByLinkingChordData(chordsData, linkingChordData)) {
      setLinkingChordData(null);
    }
  }, [chordsData, linkingChordData, setLinkingChordData]);

  return (
    <PsalmChordsViewContentWrapper>
      {chordsData.couplets.map(({ coupletContent, id }, coupletIdx) => (
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
          onLinkChord={(coupletContentId, charPosition, chord) =>
            onLinkChord(id, coupletContentId, charPosition, chord)
          }
          onStartLinkingChord={(coupletContentIdx) => setLinkingChordData({ coupletIdx, coupletContentIdx })}
        />
      ))}
    </PsalmChordsViewContentWrapper>
  );
};

export default PsalmChordsViewContent;
