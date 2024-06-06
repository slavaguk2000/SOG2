import React from 'react';

import { v4 as uuidv4 } from 'uuid';

import { CoupletContentChord } from '../../../utils/gql/types';
import { useEditableChordsData } from '../editableChordsDataProvider';
import { useChordsEditInstrumentsContext } from '../instrumentsProvider';

import { ChordableCharChordAndContentWrapper, ChordableCharChordWrapper } from './styled';

interface ChordableCharChordAndContentProps {
  fontSize: number;
  char: string;
  onAddChord: (newChordData: CoupletContentChord) => void;
}

const ChordableCharChordAndContent = ({ fontSize, char, onAddChord }: ChordableCharChordAndContentProps) => {
  const { openChordEditorDialog } = useChordsEditInstrumentsContext();
  const { mainKey } = useEditableChordsData();

  return (
    <ChordableCharChordAndContentWrapper
      onClick={() =>
        openChordEditorDialog(
          {
            id: uuidv4(),
            chordTemplate: '$m',
            rootNote: 0,
          },
          mainKey,
          onAddChord,
        )
      }
    >
      <ChordableCharChordWrapper contentFontSize={fontSize}>A</ChordableCharChordWrapper>
      {char}
    </ChordableCharChordAndContentWrapper>
  );
};

export default ChordableCharChordAndContent;
