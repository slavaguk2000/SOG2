import React from 'react';

import { PreselectBoxContent } from './styled';

const PreselectBox = ({ preselectNumber, debounceSeconds }: { preselectNumber: number; debounceSeconds?: number }) =>
  preselectNumber ? (
    <PreselectBoxContent debounceSeconds={debounceSeconds ?? 1} key={preselectNumber}>
      {preselectNumber}
    </PreselectBoxContent>
  ) : null;

export default PreselectBox;
