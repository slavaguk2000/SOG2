import React from 'react';

import { CoupletContentChord } from '../../utils/gql/types';
import CuttableText from '../CuttableText';

import ChordableText from './ChordableText';
import { useChordsEditInstrumentsContext } from './instrumentsProvider';
import { ChordAndContentWrapper, ChordWrapper } from './styled';
import { scaleDegreeToKey } from './utils';

interface ChordAndContentProps {
  chord?: CoupletContentChord;
  fontSize: number;
  mainKey: number;
  textContent: string;
  onCut: (charPosition: number) => void;
  onDeleteRequest: () => void;
  firstInLine?: boolean;
  onAddChord: (newChordData: CoupletContentChord, charPosition: number) => void;
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
}: ChordAndContentProps) => {
  const { isCutting, isChordAdding, isChordDeleting } = useChordsEditInstrumentsContext();

  const handleChordClick = () => {
    if (isChordDeleting) {
      onDeleteRequest();
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
        >
          {chord.chordTemplate.replace('$', scaleDegreeToKey[(mainKey + chord.rootNote) % 12] ?? '')}
        </ChordWrapper>
      )}
      {isCutting ? (
        <CuttableText onCharClick={onCut} text={textContent} />
      ) : isChordAdding ? (
        <ChordableText fontSize={fontSize} text={textContent} onAddChord={onAddChord} />
      ) : (
        textContent
      )}
    </ChordAndContentWrapper>
  );
};

export default ChordAndContent;
