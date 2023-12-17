import React from 'react';

import InstrumentsField from '../instrumentsField';
import SearchLine from '../SearchLine';
import TabsField from '../TabsField';

import { HeaderWrapper, SearchFieldWrapper } from './styled';

const Header = () => {
  return (
    <HeaderWrapper>
      <TabsField />
      <SearchFieldWrapper>
        <SearchLine />
      </SearchFieldWrapper>
      <InstrumentsField />
    </HeaderWrapper>
  );
};

export default Header;
