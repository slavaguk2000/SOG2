import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

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
  const { hasUndo, hasRedo, handleUndo, handleRedo } = useEditableChordsData();

  const lowerInstrumentsWithOnlyHandlers = useMemo(() => {
    const getLowerInstrumentsHandler = (key: ChordsEditLowerInstruments) => {
      switch (key) {
        case ChordsEditLowerInstruments.SAVE:
          return () => {
            navigate(-1);
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
  }, [handleRedo, handleUndo, lowerInstruments, navigate]);

  const lowerInstrumentsWithHandlers = useMemo(() => {
    const getLowerInstrumentsDisabled = (key: ChordsEditLowerInstruments) => {
      switch (key) {
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
  }, [hasRedo, hasUndo, lowerInstrumentsWithOnlyHandlers]);

  return { lowerInstrumentsWithHandlers };
};

export default useLowerInstruments;
