import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

import { updatePsalm } from '../../../utils/gql/queries';
import { Mutation, MutationUpdatePsalmArgs } from '../../../utils/gql/types';
import { useEditableChordsData } from '../editableChordsDataProvider';

export enum ChordsEditLowerInstruments {
  SAVE = 'save',
  UNDO = 'undo',
  REDO = 'redo',
}

export interface LowerInstrument {
  key: ChordsEditLowerInstruments;
  icon: ReactJSXElement;
  tooltip: string;
}

const useLowerInstruments = (lowerInstruments: Array<LowerInstrument>) => {
  const navigate = useNavigate();
  const { hasUndo, hasRedo, handleUndo, handleRedo, psalmData, clearLocalStorage } = useEditableChordsData();

  const [updatePsalmMutation] = useMutation<Pick<Mutation, 'updatePsalm'>, MutationUpdatePsalmArgs>(updatePsalm);

  const lowerInstrumentsWithOnlyHandlers = useMemo(() => {
    const getLowerInstrumentsHandler = (key: ChordsEditLowerInstruments) => {
      switch (key) {
        case ChordsEditLowerInstruments.SAVE:
          return async () => {
            if (psalmData) {
              await updatePsalmMutation({
                variables: {
                  psalmData: {
                    psalm: {
                      id: psalmData.psalm.id,
                      name: psalmData.psalm.name,
                      coupletsOrder: psalmData.psalm.coupletsOrder,
                      defaultTonality: psalmData.psalm.defaultTonality,
                      psalmNumber: psalmData.psalm.psalmNumber,
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    couplets: psalmData.couplets.map(({ id, marker, initialOrder, coupletContent, styling }) => ({
                      id,
                      marker,
                      initialOrder,
                      styling,
                      coupletContent: coupletContent.map(
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        ({ __typename, chord: { __typename: _, ...chordRest }, ...contentRest }) => ({
                          ...contentRest,
                          chord: chordRest,
                        }),
                      ),
                    })),
                  },
                },
              });
              clearLocalStorage();
            }
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              window.close();
            }
          };
        case ChordsEditLowerInstruments.REDO:
          return handleRedo;
        case ChordsEditLowerInstruments.UNDO:
          return handleUndo;
      }
    };

    return lowerInstruments.map((instrument) => ({
      ...instrument,
      handler: getLowerInstrumentsHandler(instrument.key),
    }));
  }, [clearLocalStorage, handleRedo, handleUndo, lowerInstruments, navigate, psalmData, updatePsalmMutation]);

  const lowerInstrumentsWithHandlers = useMemo(() => {
    const getLowerInstrumentsDisabled = (key: ChordsEditLowerInstruments) => {
      switch (key) {
        case ChordsEditLowerInstruments.SAVE:
          return !psalmData;
        case ChordsEditLowerInstruments.REDO:
          return !hasRedo;
        case ChordsEditLowerInstruments.UNDO:
          return !hasUndo;
      }

      return false;
    };

    return lowerInstrumentsWithOnlyHandlers.map((instrument) => ({
      ...instrument,
      disabled: getLowerInstrumentsDisabled(instrument.key),
    }));
  }, [hasRedo, hasUndo, lowerInstrumentsWithOnlyHandlers, psalmData]);

  return { lowerInstrumentsWithHandlers };
};

export default useLowerInstruments;
