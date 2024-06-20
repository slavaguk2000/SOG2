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
  fontSize: number;
  mainKey: number;
  textContent: string;
  onCut: (charPosition: number) => void;
  onDeleteRequest: () => void;
  firstInLine?: boolean;
  onAddChord: (newChordData: CoupletContentChord, charPosition: number) => void;
  onLinkChord: (chordData: CoupletContentChord, charPosition: number) => void;
  onStartLinkingChord: () => void;
  onContentClick?: () => void;
  linkingChordId?: string;
  currentChordLinking?: boolean;
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
  linkingChordId,
  currentChordLinking,
  onContentClick,
  textContentEditing,
  onTextChange,
  onLinkedChordMenu,
}: ChordAndContentProps) => {
  const {
    isCutting,
    isChordAdding,
    isChordDeleting,
    isChordEditing,
    openChordEditorDialog,
    isChordLinking,
    linkingChordData,
    isTextEditing,
  } = useChordsEditInstrumentsContext();
  const { psalmData, handleEditChord } = useEditableChordsData();
  const [editingData, setEditingData] = useState<string>('');

  if (!psalmData) {
    return null;
  }

  const isSourceChordChoosing = isChordLinking && !linkingChordData;
  const isDestinationChordChoosing = isChordLinking && !!linkingChordData;

  const linkingChordDataChord =
    linkingChordData &&
    psalmData.couplets[linkingChordData.coupletIdx]?.coupletContent[linkingChordData.coupletContentIdx]?.chord;

  const existingChordData =
    isDestinationChordChoosing && linkingChordData && linkingChordDataChord
      ? {
          chord: linkingChordDataChord,
          mainKey,
        }
      : undefined;

  const handleChordClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (isChordDeleting) {
      onDeleteRequest();
    } else if (chord) {
      if (isChordEditing) {
        openChordEditorDialog(chord, mainKey, handleEditChord, {
          left: e.pageX,
          top: e.pageY,
        });
      } else if (isSourceChordChoosing) {
        onStartLinkingChord();
      } else if (isDestinationChordChoosing && existingChordData) {
        onLinkChord(existingChordData.chord, 0);
      }
    }
  };

  const handleClick = () => {
    if (isTextEditing && !textContentEditing) {
      setEditingData(textContent);
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
      {chord && (
        <Chord
          chordData={chord}
          nonDeletable={firstInLine}
          onClick={handleChordClick}
          isChordDeleting={isChordDeleting}
          contentFontSize={fontSize}
          isChordEditing={isChordEditing}
          isSourceChordChoosing={isSourceChordChoosing}
          isDestinationChordChoosing={isDestinationChordChoosing}
          isSameChordLinking={!!(linkingChordId && linkingChordId === chord.id)}
          isCurrentChordLinking={currentChordLinking}
          mainKey={mainKey}
          onLinkedChordMenu={onLinkedChordMenu}
        />
      )}
      {isCutting ? (
        <CuttableText onCharClick={onCut} text={textContent} />
      ) : isChordAdding || isDestinationChordChoosing ? (
        <ChordableText
          fontSize={fontSize}
          text={textContent}
          onAddChord={onAddChord}
          onLinkChord={onLinkChord}
          existingChordData={existingChordData}
          chordColor={isDestinationChordChoosing ? '#37f' : undefined}
        />
      ) : textContentEditing ? (
        <TextContentEditor
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