import React from 'react';

import ChordsEditInstrumentsProvider from './instrumentsProvider';
import PsalmChordsView, { PsalmChordsViewProps } from './PsalmChordsView';

const PsalmChordsEdit = ({ data }: PsalmChordsViewProps) => {
  return (
    <ChordsEditInstrumentsProvider>
      <PsalmChordsView data={data} />
    </ChordsEditInstrumentsProvider>
  );
};

export default PsalmChordsEdit;
