import React, { useMemo } from 'react';

import { CoupletContentChord } from '../../../utils/gql/types';

import ChordableCharChordAndContent, { ChordWithMainKeyData } from './ChordableCharChordAndContent';

interface ChordableTextProps {
  text: string;
  fontSize?: number;
  onAddChord?: (newChordData: CoupletContentChord, charPosition: number) => void;
  onLinkChord?: (chordData: CoupletContentChord, charPosition: number) => void;
  existingChordData?: ChordWithMainKeyData;
  chordColor?: string;
}

const ChordableText = ({
  text,
  fontSize,
  onAddChord,
  existingChordData,
  onLinkChord,
  chordColor,
}: ChordableTextProps) => {
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
          onAddChord={onAddChord && ((chordValue) => onAddChord(chordValue, idx + 1))}
          onLinkChord={onLinkChord && ((chordValue) => onLinkChord(chordValue, idx + 1))}
          chordColor={chordColor}
        />
      ))}
    </span>
  );
};

export default ChordableText;
