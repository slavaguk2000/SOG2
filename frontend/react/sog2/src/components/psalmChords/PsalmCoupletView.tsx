import React, { useMemo, useState } from 'react';

import { Typography } from '@mui/material';

import { isChordsEquals } from '../../utils/chordUtils';
import { CoupletContent, CoupletContentChord } from '../../utils/gql/types';

import ChordAndContent from './ChordAndContent';
import { useEditableChordsData } from './editableChordsDataProvider';
import { useChordsEditInstrumentsContext } from './instrumentsProvider';
import LinkChordMenu, { MenuAnchorChordData } from './LinkChordMenu';
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
  linkingChordId?: string;
  currentLinkingChordIdx?: number;
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
  linkingChordId,
  currentLinkingChordIdx,
}: PsalmCoupletViewProps) => {
  const [menuAnchorChordData, setMenuAnchorChordData] = useState<null | MenuAnchorChordData>(null);
  const {
    isChordAdding,
    isChordDeleting,
    isChordEditing,
    isChordLinking,
    isChordCopying,
    isTextEditing,
    setEditingTextContentId,
    editingTextContentId,
  } = useChordsEditInstrumentsContext();
  const { handleEditText } = useEditableChordsData();

  const filteredCoupletContent: Array<FilteredCoupletContent> = useMemo(
    () =>
      coupletContent.map((content, idx) => ({
        ...content,
        chord:
          !(isChordAdding || isChordDeleting || isChordEditing || isChordLinking || isTextEditing || isChordCopying) &&
          idx &&
          isChordsEquals(content.chord, coupletContent[idx - 1].chord)
            ? null
            : content.chord,
      })),
    [coupletContent, isChordAdding, isChordCopying, isChordDeleting, isChordEditing, isChordLinking, isTextEditing],
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
              linkingChordId={linkingChordId}
              currentChordLinking={currentLinkingChordIdx !== undefined && currentLinkingChordIdx === idx}
              onContentClick={isTextEditing ? () => setEditingTextContentId(contentId) : undefined}
              textContentEditing={contentId === editingTextContentId}
              onTextChange={(newText) => handleEditText(contentId, newText)}
              onLinkedChordMenu={(anchor) => setMenuAnchorChordData({ anchor, contentId })}
            />
          ))}
        </Typography>
      ))}
      <LinkChordMenu menuAnchorChordData={menuAnchorChordData} onClose={() => setMenuAnchorChordData(null)} />
    </PsalmChordsViewCoupletWrapper>
  );
};

export default PsalmCoupletView;
