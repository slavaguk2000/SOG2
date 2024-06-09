import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

export enum ChordsEditLowerInstruments {
  SAVE = 'save',
}

export interface LowerInstrument {
  key: ChordsEditLowerInstruments;
  icon: ReactJSXElement;
  tooltip: string;
}

const useLowerInstruments = (lowerInstruments: Array<LowerInstrument>) => {
  const navigate = useNavigate();

  const lowerInstrumentsWithHandlers = useMemo(() => {
    const getLowerInstrumentsHandler = (key: ChordsEditLowerInstruments) => {
      switch (key) {
        case ChordsEditLowerInstruments.SAVE:
          return () => {
            navigate(-1);
          };
      }
    };

    return lowerInstruments.map((instrument) => ({
      ...instrument,
      handler: getLowerInstrumentsHandler(instrument.key),
    }));
  }, [lowerInstruments, navigate]);

  return { lowerInstrumentsWithHandlers };
};

export default useLowerInstruments;
