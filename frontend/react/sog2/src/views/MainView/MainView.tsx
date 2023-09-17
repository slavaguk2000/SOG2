import React from 'react';

import BibleContent from 'src/components/BibleContent';

import SearchLine from '../../components/SearchLine';

import { MainViewWrapper } from './styled';

const MainView = () => {
  return (
    <MainViewWrapper>
      <SearchLine />
      <BibleContent />
    </MainViewWrapper>
  );
};

export default MainView;
