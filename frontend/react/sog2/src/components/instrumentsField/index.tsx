import React from 'react';

import AudioPlayerButton from './AudioPlayerButton';
import CaptureChordsScreen from './CaptureChordsScreen';
import CaptureScreen from './CaptureScreen';
import FreeSlideDialogButton from './FreeSlideDialogButton';
import History from './history';
import SilentModeButton from './SilentModeButton';
import { InstrumentsFieldWrapper } from './styled';

const InstrumentsField = () => {
  return (
    <InstrumentsFieldWrapper>
      <AudioPlayerButton />
      <History />
      <FreeSlideDialogButton />
      <SilentModeButton />
      <CaptureChordsScreen />
      <CaptureScreen />
    </InstrumentsFieldWrapper>
  );
};

export default InstrumentsField;
