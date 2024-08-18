import React, { useState } from 'react';

import { CoupletContentChord } from '../../utils/gql/types';
import CuttableText from '../CuttableText';

import Chord from './Chord';
import ChordableText from './ChordableText';
import { useEditableChordsData } from './editableChordsDataProvider';
import { useChordsEditInstrumentsContext } from './instrumentsProvider';
import { ChordAndContentWrapper } from './styled';
import TextContentEditor from './TextContentEditor';

interface ChordAndContentProps {
  chord?: CoupletContentChord;
  fontSize?: number;
  mainKey?: number;
  textContent: string;
  onCut?: (charPosition: number) => void;
  onDeleteRequest?: () => void;
  firstInLine?: boolean;
  onAddChord?: (newChordData: CoupletContentChord, charPosition: number) => void;
  onLinkChord?: (chordData: CoupletContentChord, charPosition: number) => void;
  onStartLinkingChord?: () => void;
  onStartMovingChord?: () => void;
  onContentClick?: () => void;
  linkingChordId?: string;
  currentChordLinking?: boolean;
  currentChordMoving?: boolean;
  textContentEditing?: boolean;
  onTextChange: (newText: string) => void;
  onLinkedChordMenu: (anchor: HTMLElement) => void;
}

const ChordAndContent = ({
  chord,
  fontSize,
  mainKey,
  textContent,
  onCut,
  onDeleteRequest,
  firstInLine,
  onAddChord,
  onLinkChord,
  onStartLinkingChord,
  onStartMovingChord,
  linkingChordId,
  currentChordLinking,
  currentChordMoving,
  onContentClick,
  textContentEditing,
  onTextChange,
  onLinkedChordMenu,
}: ChordAndContentProps) => {
  const {
    isCutting,
    isChordAdding,
    isChordCopying,
    isChordDeleting,
    isChordEditing,
    isChordMoving,
    openChordEditorDialog,
    isChordLinking,
    linkingChordData,
    copyingChordData,
    isTextEditing,
    setCopyingChordData,
  } = useChordsEditInstrumentsContext();
  const { psalmData, handleEditChord } = useEditableChordsData();
  const [editingData, setEditingData] = useState<string>('');
  const [editorWidth, setEditorWidth] = useState<number>(200);

  const isLinkSourceChordChoosing = isChordLinking && !linkingChordData;
  const isLinkDestinationChordChoosing = isChordLinking && !!linkingChordData;

  const isCopySourceChordChoosing = isChordCopying && !copyingChordData;
  const isCopyDestinationChordChoosing = isChordCopying && !!copyingChordData;

  const linkingChordDataChord =
    linkingChordData &&
    psalmData?.couplets[linkingChordData.coupletIdx]?.coupletContent[linkingChordData.coupletContentIdx]?.chord;

  const existingChordData =
    isLinkDestinationChordChoosing && linkingChordData && linkingChordDataChord
      ? {
          chord: linkingChordDataChord,
          mainKey,
        }
      : isCopyDestinationChordChoosing
      ? {
          chord: copyingChordData,
          mainKey,
        }
      : undefined;

  const handleChordClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (isChordDeleting) {
      onDeleteRequest?.();
    } else if (chord) {
      if (isChordEditing && mainKey) {
        openChordEditorDialog(chord, mainKey, handleEditChord, {
          left: e.pageX,
          top: e.pageY,
        });
      } else if (isLinkSourceChordChoosing) {
        onStartLinkingChord?.();
      } else if (isLinkDestinationChordChoosing && existingChordData) {
        onLinkChord?.(existingChordData.chord, 0);
      } else if (isChordMoving) {
        onStartMovingChord?.();
      }
      if (isCopySourceChordChoosing) {
        setCopyingChordData(chord);
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (isTextEditing && !textContentEditing) {
      setEditingData(textContent);
      const spanWidth = (e.target as unknown as { offsetWidth: number }).offsetWidth;
      setEditorWidth(spanWidth);
    }

    onContentClick?.();
  };

  return (
    <ChordAndContentWrapper
      sx={{
        verticalAlign: 'sub',
      }}
      hoverable={isTextEditing && !textContentEditing}
      onClick={handleClick}
    >
      {chord && mainKey !== undefined && (
        <Chord
          chordData={chord}
          nonDeletable={firstInLine}
          onClick={handleChordClick}
          contentFontSize={fontSize}
          isLinkSourceChordChoosing={isLinkSourceChordChoosing}
          isCopySourceChordChoosing={isCopySourceChordChoosing}
          isLinkDestinationChordChoosing={isLinkDestinationChordChoosing}
          isSameChordLinking={!!(linkingChordId && linkingChordId === chord.id)}
          isCurrentChordLinking={currentChordLinking}
          isCurrentChordMoving={currentChordMoving}
          mainKey={mainKey}
          onLinkedChordMenu={onLinkedChordMenu}
        />
      )}
      {isCutting ? (
        <CuttableText onCharClick={onCut} text={textContent} />
      ) : isChordAdding || isLinkDestinationChordChoosing || isCopyDestinationChordChoosing ? (
        <ChordableText
          fontSize={fontSize}
          text={textContent}
          onAddChord={onAddChord}
          onLinkChord={onLinkChord}
          existingChordData={existingChordData}
          chordColor={isLinkDestinationChordChoosing ? '#37f' : undefined}
        />
      ) : textContentEditing ? (
        <TextContentEditor
          width={editorWidth}
          value={editingData}
          onChange={setEditingData}
          fontSize={fontSize}
          onSubmit={() => onTextChange(editingData)}
        />
      ) : (
        textContent
      )}
    </ChordAndContentWrapper>
  );
};

export default ChordAndContent;
