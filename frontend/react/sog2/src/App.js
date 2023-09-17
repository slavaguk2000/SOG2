import './App.css';
import React from 'react';

import { ThemeProvider } from '@mui/material';

import { theme } from 'src/theme';

import { AppRoot } from './styled';
import MainView from './views/MainView/MainView';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRoot>
        <MainView />
      </AppRoot>
    </ThemeProvider>
  );
}

export default App;
