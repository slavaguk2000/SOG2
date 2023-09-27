import React from 'react';

import CaptureScreen from './CaptureScreen';
import SilentModeButton from './SilentModeButton';
import { InstrumentsFieldWrapper } from './styled';

const InstrumentsField = () => {
  return (
    <InstrumentsFieldWrapper>
      <SilentModeButton />
      <CaptureScreen />
    </InstrumentsFieldWrapper>
  );
};

export default InstrumentsField;
