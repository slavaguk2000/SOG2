import React, { useEffect, useMemo } from 'react';

import { getChordByLinkingChordData } from '../../utils/chordUtils';
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
  const { setLinkingChordData, linkingChordData, isChordLinking } = useChordsEditInstrumentsContext();
  const { handleCutToNextLine, handleRemoveChord, handleAddChord, chordsData, handleLinkChords } =
    useEditableChordsData();

  const handleNextLinkingChord = (option?: { nullOnError?: boolean }) => {
    setLinkingChordData((prev) => {
      if (!prev) {
        return prev;
      }

      const nextData = {
        ...prev,
        coupletContentIdx: prev.coupletContentIdx + 1,
      };

      if (nextData.coupletContentIdx >= chordsData.couplets[nextData.coupletIdx]?.coupletContent.length ?? 0) {
        nextData.coupletIdx++;
        nextData.coupletContentIdx = 0;

        if (nextData.coupletIdx >= chordsData.couplets.length) {
          return option?.nullOnError ? null : prev;
        }
      }

      return nextData;
    });
  };

  const handlePrevLinkingChord = (option?: { nullOnError?: boolean }) => {
    setLinkingChordData((prev) => {
      if (!prev) {
        return prev;
      }

      const nextData = {
        ...prev,
        coupletContentIdx: prev.coupletContentIdx - 1,
      };

      if (nextData.coupletContentIdx < 0) {
        nextData.coupletIdx--;

        if (nextData.coupletIdx < 0 || !chordsData.couplets[nextData.coupletIdx]) {
          return option?.nullOnError ? null : prev;
        }

        nextData.coupletContentIdx = chordsData.couplets[nextData.coupletIdx].coupletContent.length - 1;
      }

      return nextData;
    });
  };

  const isLinkingChordSelected = !!(isChordLinking && linkingChordData);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'ArrowRight') {
        handleNextLinkingChord();
      } else if (event.code === 'ArrowLeft') {
        handlePrevLinkingChord();
      } else {
        return null;
      }
      if (isLinkingChordSelected) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNextLinkingChord, handlePrevLinkingChord, isLinkingChordSelected]);

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
    if (linkingChordData && !getChordByLinkingChordData(chordsData, linkingChordData)) {
      setLinkingChordData(null);
    }
  }, [chordsData, linkingChordData, setLinkingChordData]);

  const linkingChordId = useMemo(
    () => (linkingChordData && getChordByLinkingChordData(chordsData, linkingChordData)?.id) ?? undefined,
    [chordsData, linkingChordData],
  );

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
          linkingChordId={linkingChordId}
          currentLinkingChordIdx={
            linkingChordData && linkingChordData.coupletIdx === coupletIdx
              ? linkingChordData.coupletContentIdx
              : undefined
          }
        />
      ))}
    </PsalmChordsViewContentWrapper>
  );
};

export default PsalmChordsViewContent;
