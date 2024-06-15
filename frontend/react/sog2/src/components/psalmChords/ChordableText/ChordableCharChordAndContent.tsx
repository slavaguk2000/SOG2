import React from 'react';

import { v4 as uuidv4 } from 'uuid';

import { getChordText } from '../../../utils/chordUtils';
import { CoupletContentChord } from '../../../utils/gql/types';
import { useEditableChordsData } from '../editableChordsDataProvider';
import { useChordsEditInstrumentsContext } from '../instrumentsProvider';

import { ChordableCharChordAndContentWrapper, ChordableCharChordWrapper } from './styled';

export interface ChordWithMainKeyData {
  chord: CoupletContentChord;
  mainKey: number;
}

interface ChordableCharChordAndContentProps {
  fontSize: number;
  char: string;
  onAddChord: (newChordData: CoupletContentChord) => void;
  onLinkChord: (chordData: CoupletContentChord) => void;
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
  const { openChordEditorDialog } = useChordsEditInstrumentsContext();
  const { mainKey } = useEditableChordsData();

  const handleChordClick = () => {
    if (existingChordData) {
      onLinkChord(existingChordData.chord);
    } else {
      openChordEditorDialog(
        {
          id: uuidv4(),
          chordTemplate: '$m',
          rootNote: 0,
        },
        mainKey,
        onAddChord,
      );
    }
  };

  return (
    <ChordableCharChordAndContentWrapper onClick={handleChordClick}>
      <ChordableCharChordWrapper contentFontSize={fontSize} color={chordColor}>
        {existingChordData ? getChordText(existingChordData.chord, existingChordData.mainKey) : 'A'}
      </ChordableCharChordWrapper>
      {char}
    </ChordableCharChordAndContentWrapper>
  );
};

export default ChordableCharChordAndContent;
