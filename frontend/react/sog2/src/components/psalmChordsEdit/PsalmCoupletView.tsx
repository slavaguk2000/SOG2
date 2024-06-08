import React, { useMemo } from 'react';

import { Typography } from '@mui/material';

import { isChordsEquals } from '../../utils/chordUtils';
import { CoupletContent, CoupletContentChord } from '../../utils/gql/types';

import ChordAndContent from './ChordAndContent';
import { useChordsEditInstrumentsContext } from './instrumentsProvider';
import { PsalmChordsViewCoupletWrapper } from './styled';

interface PsalmCoupletViewProps {
  coupletContent: CoupletContent[];
  fontSize: number;
  mainKey: number;
  splitByLines?: boolean;
  onCut: (coupletContentId: string, charPosition: number) => void;
  onRemoveChord: (coupletContentId: string) => void;
  onAddChord: (coupletContentId: string, charPosition: number, chord: CoupletContentChord) => void;
  onLinkChord: (coupletContentId: string, charPosition: number, chord: CoupletContentChord) => void;
  onStartLinkingChord: (coupletContentIdx: number) => void;
}

interface FilteredCoupletContent extends Omit<CoupletContent, 'chord'> {
  chord: null | CoupletContentChord;
}

interface NumberedCoupletContent {
  content: FilteredCoupletContent;
  idx: number;
}

const PsalmCoupletView = ({
  coupletContent,
  fontSize,
  mainKey,
  splitByLines,
  onCut,
  onRemoveChord,
  onAddChord,
  onLinkChord,
  onStartLinkingChord,
}: PsalmCoupletViewProps) => {
  const { isChordAdding, isChordEditing } = useChordsEditInstrumentsContext();

  const filteredCoupletContent: Array<FilteredCoupletContent> = useMemo(
    () =>
      coupletContent.map((content, idx) => ({
        ...content,
        chord:
          !(isChordAdding || isChordEditing) && idx && isChordsEquals(content.chord, coupletContent[idx - 1].chord)
            ? null
            : content.chord,
      })),
    [coupletContent, isChordAdding, isChordEditing],
  );

  const { contentByLines } = useMemo(
    () =>
      splitByLines
        ? filteredCoupletContent.reduce(
            (acc: { contentByLines: Array<Array<NumberedCoupletContent>>; prevLine: null | number }, content, idx) => {
              if (acc.prevLine !== content.line) {
                acc.contentByLines.push([]);
                acc.prevLine = content.line;
              }

              acc.contentByLines[acc.contentByLines.length - 1].push({ content, idx });

              return acc;
            },
            { contentByLines: [], prevLine: null },
          )
        : {
            contentByLines: [
              filteredCoupletContent.map((content, idx) => ({ content, idx } as NumberedCoupletContent)),
            ],
          },
    [filteredCoupletContent, splitByLines],
  );

  return (
    <PsalmChordsViewCoupletWrapper>
      {contentByLines.map((coupletContentLine, idx) => (
        <Typography key={idx} align="left" lineHeight={2} fontSize={fontSize} variant="body1">
          {coupletContentLine.map(({ content: { text, id: contentId, chord }, idx }, idxInLine) => (
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
              onLinkChord={(chordData, charPosition) => onLinkChord(contentId, charPosition, chordData)}
              onStartLinkingChord={() => onStartLinkingChord(idx)}
            />
          ))}
        </Typography>
      ))}
    </PsalmChordsViewCoupletWrapper>
  );
};

export default PsalmCoupletView;
