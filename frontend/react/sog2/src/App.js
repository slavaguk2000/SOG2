import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from '@mui/material';

import { theme } from 'src/theme';

import BibleContent from './components/BibleContent';
import BibleContext from './providers/bibleDataProvider/context';
import BibleDataProvider from './providers/bibleDataProvider/provider';
import FreeSlideDialogProvider from './providers/FreeSlideDialogProvider/provider';
import InstrumentsFieldProvider from './providers/instrumentsFieldProvider/provider';
import { PresentationProvider } from './providers/presentationProvider/provider';
import SermonDataProviderContext from './providers/sermanDataProvider/context';
import SermonDataProvider from './providers/sermanDataProvider/provider';
import { AppRoot } from './styled';
import MainView from './views/MainView/MainView';
import SermonView from './views/SermanView';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <PresentationProvider>
        <FreeSlideDialogProvider>
          <InstrumentsFieldProvider>
            <AppRoot>
              <Router>
                <Routes>
                  <Route path="/" element={<Navigate to="/bible" replace />} />
                  <Route
                    path="/bible"
                    element={
                      <BibleDataProvider bibleId="0">
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
                          <SermonView />
                        </MainView>
                      </SermonDataProvider>
                    }
                  />
                </Routes>
              </Router>
            </AppRoot>
          </InstrumentsFieldProvider>
        </FreeSlideDialogProvider>
      </PresentationProvider>
    </ThemeProvider>
  );
}

export default App;
