import React from 'react';

import { v4 as uuidv4 } from 'uuid';

import { getChordText } from '../../../utils/chordUtils';
import { CoupletContentChord } from '../../../utils/gql/types';
import { useEditableChordsData } from '../editableChordsDataProvider';
import { useChordsEditInstrumentsContext } from '../instrumentsProvider';

import { ChordableCharChordAndContentWrapper, ChordableCharChordWrapper } from './styled';

export interface ChordWithMainKeyData {
  chord?: CoupletContentChord;
  mainKey?: number;
}

interface ChordableCharChordAndContentProps {
  fontSize?: number;
  char: string;
  onAddChord?: (newChordData: CoupletContentChord) => void;
  onLinkChord?: (chordData: CoupletContentChord) => void;
  existingChordData?: ChordWithMainKeyData;
  chordColor?: string;
}

const ChordableCharChordAndContent = ({
  fontSize,
  char,
  onAddChord,
  onLinkChord,
  existingChordData,
  chordColor,
}: ChordableCharChordAndContentProps) => {
  const { openChordEditorDialog, isChordLinking, isChordCopying, setCopyingChordData } =
    useChordsEditInstrumentsContext();
  const { mainKey } = useEditableChordsData();

  const handleChordClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (existingChordData?.chord) {
      if (isChordLinking && onLinkChord) {
        onLinkChord(existingChordData.chord);
      } else if (isChordCopying && onAddChord) {
        onAddChord({
          ...existingChordData.chord,
          id: uuidv4(),
        });
        setCopyingChordData(null);
      }
    } else if (onAddChord) {
      openChordEditorDialog(
        {
          id: uuidv4(),
          chordTemplate: '$m',
          rootNote: 0,
        },
        mainKey,
        onAddChord,
        {
          left: e.pageX,
          top: e.pageY,
        },
      );
    }
  };

  return (
    <ChordableCharChordAndContentWrapper onClick={handleChordClick}>
      <ChordableCharChordWrapper contentFontSize={fontSize} color={chordColor}>
        {existingChordData?.chord && existingChordData?.mainKey !== undefined
          ? getChordText(existingChordData.chord, existingChordData.mainKey)
          : 'A'}
      </ChordableCharChordWrapper>
      {char}
    </ChordableCharChordAndContentWrapper>
  );
};

export default ChordableCharChordAndContent;
