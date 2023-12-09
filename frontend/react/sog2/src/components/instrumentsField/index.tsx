import React from 'react';

import CaptureScreen from './CaptureScreen';
import FreeSlideDialogButton from './FreeSlideDialogButton';
import History from './history';
import SilentModeButton from './SilentModeButton';
import { InstrumentsFieldWrapper } from './styled';

const InstrumentsField = () => {
  return (
    <InstrumentsFieldWrapper>
      <History />
      <FreeSlideDialogButton />
      <SilentModeButton />
      <CaptureScreen />
    </InstrumentsFieldWrapper>
  );
};

export default InstrumentsField;
