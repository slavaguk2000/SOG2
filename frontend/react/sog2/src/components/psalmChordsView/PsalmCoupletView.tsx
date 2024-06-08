import React, { useMemo } from 'react';

import { Typography } from '@mui/material';

import { isChordsEquals } from '../../utils/chordUtils';
import { CoupletContent } from '../../utils/gql/types';

import { ChordAndContentWrapper, ChordWrapper, PsalmChordsViewCoupletWrapper } from './styled';
import { getScaleDegreeByMainKey, scaleDegreeToKey } from './utils';

interface PsalmCoupletViewProps {
  coupletContent: CoupletContent[];
  fontSize: number;
  mainKey: number;
  splitByLines?: boolean;
}

const PsalmCoupletView = ({ coupletContent, fontSize, mainKey, splitByLines }: PsalmCoupletViewProps) => {
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
        <Typography key={idx} align="center" lineHeight={2} fontSize={fontSize} variant="body1">
          {coupletContentLine.map(({ text, id: contentId, chord }) => (
            <ChordAndContentWrapper key={contentId}>
              {chord && (
                <ChordWrapper contentFontSize={fontSize}>
                  {chord.chordTemplate.replace(
                    '$',
                    scaleDegreeToKey[getScaleDegreeByMainKey(mainKey, chord.rootNote)] ?? '',
                  )}
                </ChordWrapper>
              )}
              {text}
            </ChordAndContentWrapper>
          ))}
        </Typography>
      ))}
    </PsalmChordsViewCoupletWrapper>
  );
};

export default PsalmCoupletView;
