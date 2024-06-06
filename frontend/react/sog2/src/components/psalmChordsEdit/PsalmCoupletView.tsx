import React, { useMemo } from 'react';

import { Typography } from '@mui/material';

import { CoupletContent, CoupletContentChord } from '../../utils/gql/types';

import ChordAndContent from './ChordAndContent';
import { useChordsEditInstrumentsContext } from './instrumentsProvider';
import { PsalmChordsViewCoupletWrapper } from './styled';
import { isChordsEquals } from './utils';

interface PsalmCoupletViewProps {
  coupletContent: CoupletContent[];
  fontSize: number;
  mainKey: number;
  splitByLines?: boolean;
  onCut: (coupletContentId: string, charPosition: number) => void;
  onRemoveChord: (coupletContentId: string) => void;
  onAddChord: (coupletContentId: string, charPosition: number, chord: CoupletContentChord) => void;
}

const PsalmCoupletView = ({
  coupletContent,
  fontSize,
  mainKey,
  splitByLines,
  onCut,
  onRemoveChord,
  onAddChord,
}: PsalmCoupletViewProps) => {
  const { isChordAdding } = useChordsEditInstrumentsContext();

  const filteredCoupletContent = useMemo(
    () =>
      coupletContent.map((content, idx) => ({
        ...content,
        chord:
          !isChordAdding && idx && isChordsEquals(content.chord, coupletContent[idx - 1].chord) ? null : content.chord,
      })),
    [coupletContent, isChordAdding],
  );

  const { contentByLines } = useMemo(
    () =>
      splitByLines
        ? filteredCoupletContent.reduce(
            (acc: { contentByLines: Array<typeof filteredCoupletContent>; prevLine: null | number }, content) => {
              if (acc.prevLine !== content.line) {
                acc.contentByLines.push([]);
                acc.prevLine = content.line;
              }

              acc.contentByLines[acc.contentByLines.length - 1].push(content);

              return acc;
            },
            { contentByLines: [], prevLine: null },
          )
        : { contentByLines: [filteredCoupletContent] },
    [filteredCoupletContent, splitByLines],
  );

  return (
    <PsalmChordsViewCoupletWrapper>
      {contentByLines.map((coupletContentLine, idx) => (
        <Typography key={idx} align="left" lineHeight={2} fontSize={fontSize} variant="body1">
          {coupletContentLine.map(({ text, id: contentId, chord }, idxInLine) => (
            <ChordAndContent
              firstInLine={!idxInLine}
              key={contentId}
              chord={chord ?? undefined}
              fontSize={fontSize}
              mainKey={mainKey}
              textContent={text}
              onCut={(charPosition) => onCut(contentId, charPosition)}
              onDeleteRequest={() => onRemoveChord(contentId)}
              onAddChord={(newChordData, charPosition) => onAddChord(contentId, charPosition, newChordData)}
            />
          ))}
        </Typography>
      ))}
    </PsalmChordsViewCoupletWrapper>
  );
};

export default PsalmCoupletView;
