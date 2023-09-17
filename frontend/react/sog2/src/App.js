import './App.css';
import React from 'react';

import { ThemeProvider } from '@mui/material';

import { theme } from 'src/theme';

import BibleDataProvider from './providers/bibleDataProvider/provider';
import { AppRoot } from './styled';
import MainView from './views/MainView/MainView';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BibleDataProvider bibleId="0">
        <AppRoot>
          <MainView />
        </AppRoot>
      </BibleDataProvider>
    </ThemeProvider>
  );
}

export default App;
