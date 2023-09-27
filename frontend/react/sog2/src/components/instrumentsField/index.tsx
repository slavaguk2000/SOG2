import React from 'react';

import CaptureScreen from './CaptureScreen';
import FreeSlideDialogButton from './FreeSlideDialogButton';
import SilentModeButton from './SilentModeButton';
import { InstrumentsFieldWrapper } from './styled';

const InstrumentsField = () => {
  return (
    <InstrumentsFieldWrapper>
      <FreeSlideDialogButton />
      <SilentModeButton />
      <CaptureScreen />
    </InstrumentsFieldWrapper>
  );
};

export default InstrumentsField;
