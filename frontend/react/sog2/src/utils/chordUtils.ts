import { LinkingChordData } from '../components/psalmChords/instrumentsProvider';
import { scaleDegreeToKey } from '../components/psalmChords/utils';

import { CoupletContentChord, MusicalKey, PsalmData } from './gql/types';

export const getChordText = (chord: CoupletContentChord, mainKey: number) =>
  chord.chordTemplate.replace(
    '$',
    `${scaleDegreeToKey[(mainKey + chord.rootNote) % 12] ?? ''}${
      typeof chord.bassNote === 'number' ? `/${scaleDegreeToKey[(mainKey + chord.bassNote) % 12] ?? ''}` : ''
    }`,
  );

export const getChordByLinkingChordData = (psalmData: PsalmData, { coupletIdx, coupletContentIdx }: LinkingChordData) =>
  psalmData.couplets[coupletIdx]?.coupletContent[coupletContentIdx]?.chord ?? null;

export const isChordsEquals = (chordA: CoupletContentChord | null, chordB: CoupletContentChord | null) =>
  !!(chordA && chordB) &&
  (['chordTemplate', 'rootNote', 'bassNote'] as Array<keyof CoupletContentChord>).every(
    (key) => chordA[key] === chordB[key],
  );

export const allPossibleTonalities = Object.values(MusicalKey).map((key) => ({
  key,
  label: key.replace('Sharp', '#'),
}));
