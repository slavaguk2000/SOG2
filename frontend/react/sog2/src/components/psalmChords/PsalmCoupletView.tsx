import React, { useMemo, useState } from 'react';

import { ButtonBase, Typography } from '@mui/material';

import { isChordsEquals } from '../../utils/chordUtils';
import { CoupletContent, CoupletContentChord } from '../../utils/gql/types';

import ChordAndContent from './ChordAndContent';
import { useEditableChordsData } from './editableChordsDataProvider';
import { useChordsEditInstrumentsContext } from './instrumentsProvider';
import LinkChordMenu, { MenuAnchorChordData } from './LinkChordMenu';
import RemoveCoupletButton from './RemoveCoupletButton';
import { PsalmChordsViewCoupletWrapper } from './styled';

interface PsalmCoupletViewProps {
  coupletId?: string;
  editing?: boolean;
  coupletContent: CoupletContent[];
  fontSize?: number;
  mainKey?: number;
  splitByLines?: boolean;
  onCut?: (coupletContentId: string, charPosition: number) => void;
  onRemoveChord?: (coupletContentId: string) => void;
  onAddChord?: (coupletContentId: string, charPosition: number, chord: CoupletContentChord) => void;
  onLinkChord?: (coupletContentId: string, charPosition: number, chord: CoupletContentChord) => void;
  onStartLinkingChord?: (coupletContentIdx: number) => void;
  onStartMovingChord?: (coupletContentIdx: number) => void;
  linkingChordId?: string;
  currentLinkingChordIdx?: number;
  currentMovingChordIdx?: number;
  onHighLightCouplet?: () => void;
  styling?: number;
  coupletMarker?: string;
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
  coupletId,
  fontSize,
  mainKey,
  splitByLines,
  onCut,
  onRemoveChord,
  onAddChord,
  onLinkChord,
  onStartLinkingChord,
  onStartMovingChord,
  linkingChordId,
  currentLinkingChordIdx,
  currentMovingChordIdx,
  onHighLightCouplet,
  styling,
  coupletMarker,
  editing,
}: PsalmCoupletViewProps) => {
  const [menuAnchorChordData, setMenuAnchorChordData] = useState<null | MenuAnchorChordData>(null);
  const {
    isGluing,
    isChordAdding,
    isChordDeleting,
    isChordEditing,
    isChordLinking,
    isChordCopying,
    isTextEditing,
    isCoupletHighlighting,
    setEditingTextContentId,
    editingTextData,
  } = useChordsEditInstrumentsContext();
  const { handleEditText, handleGlueWithNextLine } = useEditableChordsData();
  const [preGlueLine, setPreGlueLine] = useState<null | number>(null);

  const filteredCoupletContent: Array<FilteredCoupletContent> = useMemo(
    () =>
      coupletContent.map((content, idx) => ({
        ...content,
        text: coupletMarker && !idx ? `${coupletMarker}${content.text}` : content.text,
        chord:
          !(isChordAdding || isChordDeleting || isChordEditing || isChordLinking || isTextEditing || isChordCopying) &&
          idx &&
          isChordsEquals(content.chord, coupletContent[idx - 1].chord)
            ? null
            : content.chord,
      })),
    [
      coupletMarker,
      coupletContent,
      isChordAdding,
      isChordCopying,
      isChordDeleting,
      isChordEditing,
      isChordLinking,
      isTextEditing,
    ],
  );

  const { contentByLines } = useMemo(
    () =>
      splitByLines
        ? filteredCoupletContent.reduce(
            (acc: { contentByLines: Array<Array<NumberedCoupletContent>>; prevLine: null | number }, content, idx) => {
              if (
                acc.prevLine !== content.line &&
                !(isGluing && preGlueLine !== null && preGlueLine + 1 === content.line)
              ) {
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
    [filteredCoupletContent, isGluing, preGlueLine, splitByLines],
  );

  const handleCoupletClick = () => {
    if (isCoupletHighlighting && onHighLightCouplet) {
      onHighLightCouplet();
    }
  };

  const handlePreGluing = (lineNumber: number) => {
    setPreGlueLine(lineNumber);
  };

  const handleMouseLeave = () => {
    setPreGlueLine(null);
  };

  const getGluingProps = (coupletContentLine: NumberedCoupletContent[]) => {
    const currentLine = coupletContentLine[0] && coupletContentLine[0].content.line;
    const isGlueWithValidCurrentLine = isGluing && currentLine !== undefined;

    return {
      fontWeight: isGlueWithValidCurrentLine && preGlueLine === currentLine ? 'bold' : 'inherit',
      onMouseEnter: isGlueWithValidCurrentLine ? () => handlePreGluing(currentLine) : undefined,
      onMouseLeave: handleMouseLeave,
      sx: {
        cursor: isGluing ? 'pointer' : undefined,
      },
      onClick:
        isGlueWithValidCurrentLine && coupletId ? () => handleGlueWithNextLine(coupletId, currentLine) : undefined,
    };
  };

  const contentLinesJSX = contentByLines.map((coupletContentLine, idx) => (
    <Typography
      key={idx}
      align="left"
      lineHeight={2}
      fontSize={fontSize}
      variant="body1"
      {...getGluingProps(coupletContentLine)}
    >
      {coupletContentLine.map(({ content: { text, id: contentId, chord }, idx }, idxInLine) => (
        <ChordAndContent
          firstInLine={!idxInLine}
          key={contentId}
          chord={chord ?? undefined}
          fontSize={fontSize}
          mainKey={mainKey}
          textContent={text}
          onCut={onCut && ((charPosition) => onCut(contentId, charPosition))}
          onDeleteRequest={onRemoveChord && (() => onRemoveChord(contentId))}
          onAddChord={onAddChord && ((newChordData, charPosition) => onAddChord(contentId, charPosition, newChordData))}
          onLinkChord={onLinkChord && ((chordData, charPosition) => onLinkChord(contentId, charPosition, chordData))}
          onStartLinkingChord={onStartLinkingChord && (() => onStartLinkingChord(idx))}
          onStartMovingChord={onStartMovingChord && (() => onStartMovingChord(idx))}
          linkingChordId={linkingChordId}
          currentChordLinking={currentLinkingChordIdx !== undefined && currentLinkingChordIdx === idx}
          currentChordMoving={currentMovingChordIdx !== undefined && currentMovingChordIdx === idx}
          onContentClick={isTextEditing ? () => setEditingTextContentId(contentId) : undefined}
          textContentEditing={isTextEditing && contentId === editingTextData.contentId}
          onTextChange={(newText) => handleEditText(contentId, newText)}
          onLinkedChordMenu={(anchor) => setMenuAnchorChordData({ anchor, contentId })}
        />
      ))}
    </Typography>
  ));

  return (
    <PsalmChordsViewCoupletWrapper
      gap={isGluing ? '10px' : undefined}
      styling={styling}
      hoverable={isCoupletHighlighting}
      onClick={handleCoupletClick}
    >
      {editing && coupletId ? <RemoveCoupletButton coupletId={coupletId} /> : null}
      {isCoupletHighlighting ? <ButtonBase component="div">{contentLinesJSX}</ButtonBase> : contentLinesJSX}
      <LinkChordMenu menuAnchorChordData={menuAnchorChordData} onClose={() => setMenuAnchorChordData(null)} />
    </PsalmChordsViewCoupletWrapper>
  );
};

export default PsalmCoupletView;
