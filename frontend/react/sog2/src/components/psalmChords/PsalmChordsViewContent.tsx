import React, { useCallback, useEffect, useMemo } from 'react';

import { getChordByMovingLinkingChordData } from '../../utils/chordUtils';
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
  const { setLinkingChordData, linkingChordData, setMovingChordData, movingChordData, isChordLinking, isChordMoving } =
    useChordsEditInstrumentsContext();
  const {
    handleCutToNextLine,
    handleRemoveChord,
    handleAddChord,
    psalmData,
    handleLinkChords,
    toggleCoupletHighlighting,
    handleMoveChord,
  } = useEditableChordsData();

  const handleNextLinkingChord = useCallback(
    (option?: { nullOnError?: boolean }) => {
      setLinkingChordData((prev) => {
        if (!(prev && psalmData)) {
          return prev;
        }

        const nextData = {
          ...prev,
          coupletContentIdx: prev.coupletContentIdx + 1,
        };

        if (nextData.coupletContentIdx >= psalmData.couplets[nextData.coupletIdx]?.coupletContent.length ?? 0) {
          nextData.coupletIdx++;
          nextData.coupletContentIdx = 0;

          if (nextData.coupletIdx >= psalmData.couplets.length) {
            return option?.nullOnError ? null : prev;
          }
        }

        return nextData;
      });
    },
    [psalmData, setLinkingChordData],
  );

  const handlePrevLinkingChord = useCallback(
    (option?: { nullOnError?: boolean }) => {
      setLinkingChordData((prev) => {
        if (!(prev && psalmData)) {
          return prev;
        }

        const nextData = {
          ...prev,
          coupletContentIdx: prev.coupletContentIdx - 1,
        };

        if (nextData.coupletContentIdx < 0) {
          nextData.coupletIdx--;

          if (nextData.coupletIdx < 0 || !psalmData.couplets[nextData.coupletIdx]) {
            return option?.nullOnError ? null : prev;
          }

          nextData.coupletContentIdx = psalmData.couplets[nextData.coupletIdx].coupletContent.length - 1;
        }

        return nextData;
      });
    },
    [psalmData, setLinkingChordData],
  );

  const isLinkingChordSelected = !!(isChordLinking && linkingChordData);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'ArrowRight') {
        if (isLinkingChordSelected) {
          handleNextLinkingChord();
        } else if (isChordMoving && movingChordData) {
          handleMoveChord(movingChordData.coupletIdx, movingChordData.coupletContentIdx, false);
        } else {
          return null;
        }
        event.preventDefault();
      } else if (event.code === 'ArrowLeft') {
        if (isLinkingChordSelected) {
          handlePrevLinkingChord();
        } else if (isChordMoving && movingChordData) {
          handleMoveChord(movingChordData.coupletIdx, movingChordData.coupletContentIdx, true);
        } else {
          return null;
        }
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    handleNextLinkingChord,
    handlePrevLinkingChord,
    isLinkingChordSelected,
    movingChordData,
    handleMoveChord,
    isChordMoving,
  ]);

  const onLinkChord = (
    coupletId: string,
    coupletContentId: string,
    charPosition: number,
    chord: CoupletContentChord,
  ) => {
    handleLinkChords(coupletId, coupletContentId, charPosition, chord);

    handleNextLinkingChord({ nullOnError: true });
  };

  useEffect(() => {
    if (psalmData && linkingChordData && !getChordByMovingLinkingChordData(psalmData, linkingChordData)) {
      setLinkingChordData(null);
    }
  }, [psalmData, linkingChordData, setLinkingChordData]);

  const linkingChordId = useMemo(
    () =>
      (linkingChordData && psalmData && getChordByMovingLinkingChordData(psalmData, linkingChordData)?.id) ?? undefined,
    [psalmData, linkingChordData],
  );

  return (
    <PsalmChordsViewContentWrapper>
      {psalmData?.couplets.map(({ coupletContent, id, styling }, coupletIdx) => (
        <PsalmCoupletView
          key={id}
          coupletId={id}
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
          onStartMovingChord={(coupletContentIdx) => setMovingChordData({ coupletIdx, coupletContentIdx })}
          linkingChordId={linkingChordId}
          currentLinkingChordIdx={
            linkingChordData && linkingChordData.coupletIdx === coupletIdx
              ? linkingChordData.coupletContentIdx
              : undefined
          }
          currentMovingChordIdx={
            movingChordData && movingChordData.coupletIdx === coupletIdx ? movingChordData.coupletContentIdx : undefined
          }
          onHighLightCouplet={() => toggleCoupletHighlighting(id)}
          styling={styling}
        />
      ))}
    </PsalmChordsViewContentWrapper>
  );
};

export default PsalmChordsViewContent;
