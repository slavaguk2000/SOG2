import { CoupletContentChord } from '../../utils/gql/types';

export const keyToScaleDegree: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

export const scaleDegreeToKey: Record<number, string> = {
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'D#',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'G#',
  9: 'A',
  10: 'A#',
  11: 'B',
};

export const isChordsEquals = (chordA: CoupletContentChord, chordB: CoupletContentChord) =>
  (['rootNote', 'chordTemplate', 'bassNote'] as Array<keyof CoupletContentChord>).every(
    (key) => chordB[key] === chordA[key],
  );
