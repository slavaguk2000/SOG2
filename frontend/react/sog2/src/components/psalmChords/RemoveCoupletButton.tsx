import React from 'react';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { useEditableChordsData } from './editableChordsDataProvider';
import { RemoveCoupletButtonWrapper } from './styled';

interface RemoveCoupletButtonProps {
  coupletId: string;
}

const RemoveCoupletButton = ({ coupletId }: RemoveCoupletButtonProps) => {
  const { removeCouplet } = useEditableChordsData();

  return (
    <RemoveCoupletButtonWrapper onClick={() => removeCouplet(coupletId)}>
      <DeleteForeverIcon />
    </RemoveCoupletButtonWrapper>
  );
};

export default RemoveCoupletButton;
