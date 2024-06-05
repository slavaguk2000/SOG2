import React from 'react';

import { CoupletContentChord } from '../../utils/gql/types';
import CuttableText from '../CuttableText';

import { useChordsEditInstrumentsContext } from './instrumentsProvider';
import { ChordAndContentWrapper, ChordWrapper } from './styled';
import { scaleDegreeToKey } from './utils';

interface ChordAndContentProps {
  chord?: CoupletContentChord;
  fontSize: number;
  mainKey: number;
  textContent: string;
  onCut: (charPosition: number) => void;
}

const ChordAndContent = ({ chord, fontSize, mainKey, textContent, onCut }: ChordAndContentProps) => {
  const { currentInstrument } = useChordsEditInstrumentsContext();

  const isCutting = currentInstrument === 'cut';

  return (
    <ChordAndContentWrapper>
      {chord && (
        <ChordWrapper contentFontSize={fontSize}>
          {chord.chordTemplate.replace('$', scaleDegreeToKey[(mainKey + chord.rootNote) % 12] ?? '')}
        </ChordWrapper>
      )}
      {isCutting ? <CuttableText onCharClick={onCut} text={textContent} /> : textContent}
    </ChordAndContentWrapper>
  );
};

export default ChordAndContent;
