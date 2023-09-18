import React from 'react';

import InstrumentsField from '../instrumentsField';
import SearchLine from '../SearchLine';

import { HeaderWrapper, SearchFieldWrapper } from './styled';

const Header = () => {
  return (
    <HeaderWrapper>
      <SearchFieldWrapper>
        <SearchLine />
      </SearchFieldWrapper>
      <InstrumentsField />
    </HeaderWrapper>
  );
};

export default Header;
