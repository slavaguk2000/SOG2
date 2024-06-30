import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Box, ThemeProvider } from '@mui/material';

import { theme } from 'src/theme';

import BibleContent from './components/BibleContent';
import PsalmsContent from './components/PsalmsContent';
import SermonsContent from './components/SermonsContent';
import ActivePsalmChordsPage from './pages/ActivePsalmChordsPage';
import PsalmChordEditPage from './pages/psalmChordEditPage';
import AudioMappingProvider from './providers/AudioMapping/provider';
import BibleContext from './providers/dataProviders/bibleDataProvider/context';
import BibleDataProvider from './providers/dataProviders/bibleDataProvider/provider';
import PsalmsDataProvider, { PsalmsContext } from './providers/dataProviders/psalmsDataProvider';
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
            <Box overflow="hidden">
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
                          <Route
                            path="/psalms"
                            element={
                              <PsalmsDataProvider>
                                <MainView dataProviderContext={PsalmsContext}>
                                  <PsalmsContent />
                                </MainView>
                              </PsalmsDataProvider>
                            }
                          />
                          <Route path="/psalms/chords-edit" element={<PsalmChordEditPage />} />
                          <Route path="/active-psalm/chords" element={<ActivePsalmChordsPage />} />
                        </Routes>
                      </InstrumentsFieldProvider>
                    </AudioMappingProvider>
                  </PlayerContextProvider>
                </Router>
              </AppRoot>
            </Box>
          </FreeSlideDialogProvider>
        </PresentationProvider>
      </MainScreenRatioProvider>
    </ThemeProvider>
  );
}

export default App;
