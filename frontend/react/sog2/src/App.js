import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Box, ThemeProvider } from '@mui/material';

import { theme } from 'src/theme';

import BibleContent from './components/BibleContent';
import SermonsContent from './components/SermonsContent';
import ActivePsalmChordsPage from './pages/ActivePsalmChordsPage';
import ActiveSlidePage from './pages/ActiveSlidePage';
import PsalmChordEditPage from './pages/psalmChordEditPage';
import PsalmsPage from './pages/psalmsPage';
import AudioMappingProvider from './providers/AudioMapping/provider';
import BibleContext from './providers/dataProviders/bibleDataProvider/context';
import BibleDataProvider from './providers/dataProviders/bibleDataProvider/provider';
import ChaptersProvider from './providers/dataProviders/sermanDataProvider/ChaptersProvider';
import SermonDataProviderContext from './providers/dataProviders/sermanDataProvider/context';
import SermonDataProvider from './providers/dataProviders/sermanDataProvider/provider';
import SermonsProvider from './providers/dataProviders/sermanDataProvider/SermonsProvider';
import FreeSlideDialogProvider from './providers/FreeSlideDialogProvider/provider';
import InstrumentsFieldProvider from './providers/instrumentsFieldProvider/provider';
import MainScreenRatioProvider from './providers/MainScreenSegmentationDataProvider/provider';
import PlayerContextProvider from './providers/playerProvider';
import { PresentationProvider } from './providers/presentationProvider/provider';
import SearchContextProvider from './providers/searchProvider';
import { AppRoot } from './styled';
import { TabType } from './utils/gql/types';
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
                          <Route path="/" element={<Navigate to="/psalms" replace />} />
                          <Route
                            path="/bible"
                            element={
                              <BibleDataProvider>
                                <SearchContextProvider tabType={TabType.Bible}>
                                  <MainView dataProviderContext={BibleContext}>
                                    <BibleContent />
                                  </MainView>
                                </SearchContextProvider>
                              </BibleDataProvider>
                            }
                          />
                          <Route
                            path="/sermon"
                            element={
                              <SermonsProvider>
                                <ChaptersProvider>
                                  <SermonDataProvider>
                                    <SearchContextProvider tabType={TabType.Sermon}>
                                      <MainView dataProviderContext={SermonDataProviderContext}>
                                        <SermonsContent />
                                      </MainView>
                                    </SearchContextProvider>
                                  </SermonDataProvider>
                                </ChaptersProvider>
                              </SermonsProvider>
                            }
                          />
                          <Route path="/psalms" element={<PsalmsPage />} />
                          <Route path="/psalms/chords-edit" element={<PsalmChordEditPage />} />
                          <Route path="/active-psalm/chords" element={<ActivePsalmChordsPage />} />
                          <Route path="/active-slide" element={<ActiveSlidePage />} />
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
