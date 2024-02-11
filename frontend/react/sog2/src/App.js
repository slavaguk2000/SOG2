import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from '@mui/material';

import { theme } from 'src/theme';

import BibleContent from './components/BibleContent';
import SermonsContent from './components/SermonsContent';
import BibleContext from './providers/bibleDataProvider/context';
import BibleDataProvider from './providers/bibleDataProvider/provider';
import FreeSlideDialogProvider from './providers/FreeSlideDialogProvider/provider';
import InstrumentsFieldProvider from './providers/instrumentsFieldProvider/provider';
import PlayerContextProvider from './providers/playerProvider';
import { PresentationProvider } from './providers/presentationProvider/provider';
import SermonDataProviderContext from './providers/sermanDataProvider/context';
import SermonDataProvider from './providers/sermanDataProvider/provider';
import { AppRoot } from './styled';
import MainView from './views/MainView/MainView';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <PresentationProvider>
        <FreeSlideDialogProvider>
          <AppRoot>
            <Router>
              <PlayerContextProvider>
                <InstrumentsFieldProvider>
                  <Routes>
                    <Route path="/" element={<Navigate to="/bible" replace />} />
                    <Route
                      path="/bible"
                      element={
                        <BibleDataProvider>
                          <MainView dataProviderContext={BibleContext}>
                            <BibleContent />
                          </MainView>
                        </BibleDataProvider>
                      }
                    />
                    <Route
                      path="/sermon"
                      element={
                        <SermonDataProvider>
                          <MainView dataProviderContext={SermonDataProviderContext}>
                            <SermonsContent />
                          </MainView>
                        </SermonDataProvider>
                      }
                    />
                  </Routes>
                </InstrumentsFieldProvider>
              </PlayerContextProvider>
            </Router>
          </AppRoot>
        </FreeSlideDialogProvider>
      </PresentationProvider>
    </ThemeProvider>
  );
}

export default App;
