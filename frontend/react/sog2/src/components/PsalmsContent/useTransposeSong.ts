import { useState } from 'react';

import { useMutation } from '@apollo/client';

import { updatePsalmTransposition } from '../../utils/gql/queries';
import { Maybe, MusicalKey, Mutation, MutationUpdatePsalmTranspositionArgs } from '../../utils/gql/types';
import { keyToScaleDegree } from '../psalmChords/utils';

const useTransposeSong = (
  psalmBookId?: string,
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
    if (psalmBookId && defaultTonality && psalmId) {
      updatePsalmTranspositionMutation({
        variables: {
          psalmId,
          psalmBookId,
          transposition: currentTransposition,
        },
      }).catch((e) => console.error(e));
    }
    onTransposeFinished?.();
  };

  const handleUpdateTranspose = (newTonality: MusicalKey) => {
    const defaultTonalityScaleDegree = defaultTonality && keyToScaleDegree[defaultTonality];
    const newTonalityScaleDegree = keyToScaleDegree[newTonality];

    if (newTonalityScaleDegree && defaultTonalityScaleDegree) {
      setCurrentTransposition(newTonalityScaleDegree - defaultTonalityScaleDegree);
    }
  };

  return {
    handleTransposeSong,
    handleUpdateTranspose,
  };
};

export default useTransposeSong;
