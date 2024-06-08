import React, { useMemo } from 'react';

import { CoupletContentChord } from '../../../utils/gql/types';

import ChordableCharChordAndContent, { ChordWithMainKeyData } from './ChordableCharChordAndContent';

interface ChordableTextProps {
  text: string;
  fontSize: number;
  onAddChord: (newChordData: CoupletContentChord, charPosition: number) => void;
  onLinkChord: (chordData: CoupletContentChord, charPosition: number) => void;
  existingChordData?: ChordWithMainKeyData;
}

const ChordableText = ({ text, fontSize, onAddChord, existingChordData, onLinkChord }: ChordableTextProps) => {
  const chars = useMemo(() => text.split(''), [text]);

  if (!text.length) {
    return null;
  }

  const [firstChar, ...restChars] = chars;

  return (
    <span>
      <span>{firstChar}</span>
      {restChars.map((char, idx) => (
        <ChordableCharChordAndContent
          key={idx}
          fontSize={fontSize}
          char={char}
          existingChordData={existingChordData}
          onAddChord={(chordValue) => onAddChord(chordValue, idx + 1)}
          onLinkChord={(chordValue) => onLinkChord(chordValue, idx + 1)}
        />
      ))}
    </span>
  );
};

export default ChordableText;
