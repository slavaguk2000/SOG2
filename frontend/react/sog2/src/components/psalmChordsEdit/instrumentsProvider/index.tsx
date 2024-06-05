import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import { Box, ButtonGroup } from '@mui/material';

import { SelectableButton } from '../styled';

type ChordsEditInstrumentsContextType = {
  currentInstrument?: string;
};

const defaultValue: ChordsEditInstrumentsContextType = {};

export const ChordsEditInstrumentsContext = createContext<ChordsEditInstrumentsContextType>(defaultValue);

ChordsEditInstrumentsContext.displayName = 'ChordsEditInstrumentsContext';

export const useChordsEditInstrumentsContext = () => {
  return useContext(ChordsEditInstrumentsContext);
};

const ChordsEditInstrumentsProvider = ({ children }: PropsWithChildren) => {
  // instruments
  const instruments = [
    {
      key: 'cut',
      label: 'CUT',
    },
    {
      key: 'one',
      label: 'one',
    },
    {
      key: 'two',
      label: 'two',
    },
  ];
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);

  const handleInstrumentClick = (key: string) => {
    setSelectedInstrument((p) => {
      if (key === p) {
        return null;
      }

      return key;
    });
  };

  return (
    <ChordsEditInstrumentsContext.Provider
      value={{
        currentInstrument: selectedInstrument ?? undefined,
      }}
    >
      <Box display="flex" width="100%">
        <Box width="50px">
          <ButtonGroup orientation="vertical" aria-label="Vertical button group" variant="text">
            {instruments.map(({ label, key }) => (
              <SelectableButton
                selected={selectedInstrument === key}
                onClick={() => handleInstrumentClick(key)}
                key={key}
              >
                {label}
              </SelectableButton>
            ))}
          </ButtonGroup>
        </Box>
        {children}
      </Box>
    </ChordsEditInstrumentsContext.Provider>
  );
};

export default ChordsEditInstrumentsProvider;
