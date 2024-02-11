import React from 'react';

import { Box, Collapse } from '@mui/material';

import { usePlayerContext } from '../../providers/playerProvider';
import AudioPlayer from '../../providers/playerProvider/AudioPlayer';
import InstrumentsField from '../instrumentsField';
import SearchLine from '../SearchLine';
import TabsField from '../TabsField';

import { HeaderRowWrapper, HeaderWrapper, SearchFieldWrapper } from './styled';

const Header = () => {
  const { openInterface } = usePlayerContext();

  return (
    <HeaderWrapper>
      <HeaderRowWrapper>
        <TabsField />
        <SearchFieldWrapper>
          <SearchLine />
        </SearchFieldWrapper>
        <InstrumentsField />
      </HeaderRowWrapper>

      <Collapse in={openInterface}>
        <Box display="flex">
          <AudioPlayer />
        </Box>
      </Collapse>
    </HeaderWrapper>
  );
};

export default Header;
