import React, { useMemo } from 'react';

import { Box } from '@mui/material';

import { allPossibleTonalities } from '../../../utils/chordUtils';
import { MusicalKey } from '../../../utils/gql/types';
import ChordWheelSelector from '../../psalmChords/ChordEditor/ChordWheelSelector';

interface SongTransposerProps {
  defaultTonality: MusicalKey;
  onUpdateTranspose: (newTonality: MusicalKey) => void;
}

const SongTransposer = ({ defaultTonality, onUpdateTranspose }: SongTransposerProps) => {
  const initIdx = useMemo(
    () => allPossibleTonalities.findIndex(({ key }) => key === defaultTonality),
    [defaultTonality],
  );

  return (
    <Box display="flex" alignItems="center">
      <Box>Transpose song</Box>
      <ChordWheelSelector
        height={20}
        values={allPossibleTonalities}
        paddings={5}
        initIdx={initIdx >= 0 ? initIdx : undefined}
        onChange={(newTonality) => onUpdateTranspose(newTonality as MusicalKey)}
      />
    </Box>
  );
};
export default SongTransposer;
