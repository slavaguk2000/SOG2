import React from 'react';

import AddIcon from '@mui/icons-material/Add';

import { useEditableChordsData } from './editableChordsDataProvider';
import { NewCoupletButtonWrapper } from './styled';

const NewCoupletButton = () => {
  const { addCouplet } = useEditableChordsData();

  return (
    <NewCoupletButtonWrapper variant="contained" onClick={() => addCouplet()}>
      <AddIcon />
    </NewCoupletButtonWrapper>
  );
};

export default NewCoupletButton;
