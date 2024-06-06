import React from 'react';

import ChordWheelSelector from './ChordWheelSelector';
import { ChordEditorWrapper } from './styled';

interface ChordEditorProps {
  initIdx?: number;
  fontSize: number;
  withEmpty?: boolean;
  onChange?: (newValue: string) => void;
}

const values = ['A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab'];

const withEmptyValues = ['', ...values];

const offsetAC = 3;

export const getIdxByScaleDegree = (scaleDegree: number) => (offsetAC + scaleDegree) % 12;

const ChordEditor = ({ fontSize, withEmpty, onChange, initIdx }: ChordEditorProps) => {
  return (
    <ChordEditorWrapper>
      <ChordWheelSelector
        height={fontSize}
        paddings={10}
        values={withEmpty ? withEmptyValues : values}
        onChange={onChange}
        initIdx={initIdx}
      />
    </ChordEditorWrapper>
  );
};

export default ChordEditor;
