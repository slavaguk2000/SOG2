import React from 'react';

import AudioPlayerButton from './AudioPlayerButton';
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
      <CaptureScreen />
    </InstrumentsFieldWrapper>
  );
};

export default InstrumentsField;
