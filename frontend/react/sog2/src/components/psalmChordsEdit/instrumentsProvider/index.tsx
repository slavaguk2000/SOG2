import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { Box, ButtonGroup, Tooltip } from '@mui/material';

import { NewLineIcon, SelectableButton } from '../styled';

type ChordsEditInstrumentsContextType = {
  currentInstrument?: string;
};

const defaultValue: ChordsEditInstrumentsContextType = {};

export const ChordsEditInstrumentsContext = createContext<ChordsEditInstrumentsContextType>(defaultValue);

ChordsEditInstrumentsContext.displayName = 'ChordsEditInstrumentsContext';

export const useChordsEditInstrumentsContext = () => {
  return useContext(ChordsEditInstrumentsContext);
};

export enum ChordsEditInstruments {
  CUT_TO_NEXT_LINE = 'cut',
}

const ChordsEditInstrumentsProvider = ({ children }: PropsWithChildren) => {
  // instruments
  const instruments = [
    {
      key: ChordsEditInstruments.CUT_TO_NEXT_LINE,
      label: 'CUT',
      icon: <NewLineIcon />,
      tooltip: 'Cut line',
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        event.preventDefault();
        setSelectedInstrument(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ChordsEditInstrumentsContext.Provider
      value={{
        currentInstrument: selectedInstrument ?? undefined,
      }}
    >
      <Box display="flex" width="100%">
        <Box width="50px">
          <ButtonGroup orientation="vertical" aria-label="Vertical button group" variant="text">
            {instruments.map(({ label, key, icon, tooltip }) => (
              <Tooltip title={tooltip} key={key} placement="right">
                <SelectableButton selected={selectedInstrument === key} onClick={() => handleInstrumentClick(key)}>
                  {icon ?? label}
                </SelectableButton>
              </Tooltip>
            ))}
          </ButtonGroup>
        </Box>
        {children}
      </Box>
    </ChordsEditInstrumentsContext.Provider>
  );
};

export default ChordsEditInstrumentsProvider;
