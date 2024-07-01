import { useState } from 'react';

import { useMutation } from '@apollo/client';

import { updatePsalmTransposition } from '../../../utils/gql/queries';
import { Maybe, MusicalKey, Mutation, MutationUpdatePsalmTranspositionArgs } from '../../../utils/gql/types';
import { keyToScaleDegree } from '../../psalmChords/utils';

const useTransposeSong = (
  psalmsBookId?: string,
  psalmId?: string,
  defaultTonality?: Maybe<MusicalKey>,
  onTransposeFinished?: () => void,
) => {
  const [currentTransposition, setCurrentTransposition] = useState<number>(0);

  const [updatePsalmTranspositionMutation] = useMutation<
    Pick<Mutation, 'updatePsalmTransposition'>,
    MutationUpdatePsalmTranspositionArgs
  >(updatePsalmTransposition);

  const handleTransposeSong = () => {
    if (psalmsBookId && defaultTonality && psalmId) {
      updatePsalmTranspositionMutation({
        variables: {
          psalmId,
          psalmsBookId,
          transposition: currentTransposition,
        },
      }).catch((e) => console.error(e));
    }
    onTransposeFinished?.();
  };

  const handleUpdateTranspose = (newTonality: MusicalKey) => {
    const defaultTonalityScaleDegree = defaultTonality && keyToScaleDegree[defaultTonality];
    const newTonalityScaleDegree = keyToScaleDegree[newTonality];

    if (
      typeof (newTonalityScaleDegree as number | undefined) === 'number' &&
      typeof defaultTonalityScaleDegree === 'number'
    ) {
      setCurrentTransposition(newTonalityScaleDegree - defaultTonalityScaleDegree);
    }
  };

  return {
    handleTransposeSong,
    handleUpdateTranspose,
  };
};

export default useTransposeSong;
