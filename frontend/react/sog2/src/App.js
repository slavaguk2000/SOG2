import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from '@mui/material';

import { theme } from 'src/theme';

import BibleContent from './components/BibleContent';
import PsalmsContent from './components/PsalmsContent';
import SermonsContent from './components/SermonsContent';
import AudioMappingProvider from './providers/AudioMapping/provider';
import BibleContext from './providers/dataProviders/bibleDataProvider/context';
import BibleDataProvider from './providers/dataProviders/bibleDataProvider/provider';
import SermonDataProviderContext from './providers/dataProviders/sermanDataProvider/context';
import SermonDataProvider from './providers/dataProviders/sermanDataProvider/provider';
import FreeSlideDialogProvider from './providers/FreeSlideDialogProvider/provider';
import InstrumentsFieldProvider from './providers/instrumentsFieldProvider/provider';
import MainScreenRatioProvider from './providers/MainScreenSegmentationDataProvider/provider';
import PlayerContextProvider from './providers/playerProvider';
import { PresentationProvider } from './providers/presentationProvider/provider';
import { AppRoot } from './styled';
import MainView from './views/MainView/MainView';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MainScreenRatioProvider>
        <PresentationProvider>
          <FreeSlideDialogProvider>
            <AppRoot>
              <Router>
                <PlayerContextProvider>
                  <AudioMappingProvider>
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
                  </AudioMappingProvider>
                </PlayerContextProvider>
              </Router>
            </AppRoot>
          </FreeSlideDialogProvider>
        </PresentationProvider>
      </MainScreenRatioProvider>
    </ThemeProvider>
  );
}

export default App;
