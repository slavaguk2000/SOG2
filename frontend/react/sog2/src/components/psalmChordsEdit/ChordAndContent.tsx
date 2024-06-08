import React from 'react';

import { getChordText } from '../../utils/chordUtils';
import { CoupletContentChord } from '../../utils/gql/types';
import CuttableText from '../CuttableText';

import ChordableText from './ChordableText';
import { useEditableChordsData } from './editableChordsDataProvider';
import { useChordsEditInstrumentsContext } from './instrumentsProvider';
import { ChordAndContentWrapper, ChordWrapper } from './styled';

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
  linkingChordId?: string;
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
}: ChordAndContentProps) => {
  const {
    isCutting,
    isChordAdding,
    isChordDeleting,
    isChordEditing,
    openChordEditorDialog,
    isChordLinking,
    linkingChordData,
  } = useChordsEditInstrumentsContext();
  const { chordsData, handleEditChord } = useEditableChordsData();

  const isSourceChordChoosing = isChordLinking && !linkingChordData;
  const isDestinationChordChoosing = isChordLinking && !!linkingChordData;

  const linkingChordDataChord =
    linkingChordData &&
    chordsData.couplets[linkingChordData.coupletIdx]?.coupletContent[linkingChordData.coupletContentIdx]?.chord;

  const existingChordData =
    isDestinationChordChoosing && linkingChordData && linkingChordDataChord
      ? {
          chord: linkingChordDataChord,
          mainKey,
        }
      : undefined;

  const handleChordClick = () => {
    if (isChordDeleting) {
      onDeleteRequest();
    } else if (chord) {
      if (isChordEditing) {
        openChordEditorDialog(chord, mainKey, handleEditChord);
      } else if (isSourceChordChoosing) {
        onStartLinkingChord();
      } else if (isDestinationChordChoosing && existingChordData) {
        onLinkChord(existingChordData.chord, 0);
      }
    }
  };

  return (
    <ChordAndContentWrapper
      sx={{
        verticalAlign: 'sub',
      }}
    >
      {chord && (
        <ChordWrapper
          nonDeletable={firstInLine}
          onClick={handleChordClick}
          isChordDeleting={isChordDeleting}
          contentFontSize={fontSize}
          isChordEditing={isChordEditing}
          isSourceChordChoosing={isSourceChordChoosing}
          isDestinationChordChoosing={isDestinationChordChoosing}
          isCurrentChordLinking={!!(linkingChordId && linkingChordId === chord.id)}
        >
          {getChordText(chord, mainKey)}
        </ChordWrapper>
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
      ) : (
        textContent
      )}
    </ChordAndContentWrapper>
  );
};

export default ChordAndContent;
