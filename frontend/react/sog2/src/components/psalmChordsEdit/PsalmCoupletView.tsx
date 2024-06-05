import React, { useMemo } from 'react';

import { Typography } from '@mui/material';

import { CoupletContent } from '../../utils/gql/types';

import ChordAndContent from './ChordAndContent';
import { PsalmChordsViewCoupletWrapper } from './styled';
import { isChordsEquals } from './utils';

interface PsalmCoupletViewProps {
  coupletContent: CoupletContent[];
  fontSize: number;
  mainKey: number;
  splitByLines?: boolean;
  onCut: (coupletContentId: string, charPosition: number) => void;
}

const PsalmCoupletView = ({ coupletContent, fontSize, mainKey, splitByLines, onCut }: PsalmCoupletViewProps) => {
  const filteredCoupletContent = useMemo(
    () =>
      coupletContent.map((content, idx) => ({
        ...content,
        chord: idx && isChordsEquals(content.chord, coupletContent[idx - 1].chord) ? null : content.chord,
      })),
    [coupletContent],
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
          {coupletContentLine.map(({ text, id: contentId, chord }) => (
            <ChordAndContent
              key={contentId}
              chord={chord ?? undefined}
              fontSize={fontSize}
              mainKey={mainKey}
              textContent={text}
              onCut={(charPosition) => onCut(contentId, charPosition)}
            />
          ))}
        </Typography>
      ))}
    </PsalmChordsViewCoupletWrapper>
  );
};

export default PsalmCoupletView;
