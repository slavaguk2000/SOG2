import React, { useEffect } from 'react';

import BibleContent from 'src/components/BibleContent';
import Header from 'src/components/header';
import { useBibleData } from 'src/providers/bibleDataProvider';

import { MainViewWrapper } from './styled';

const MainView = () => {
  const { handleUpdateSlide } = useBibleData();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      e.stopPropagation();

      if (['Enter', 'Escape'].includes(e.key)) {
        handleUpdateSlide();
      }
    };

    addEventListener('keydown', handleKeydown);

    return () => removeEventListener('keydown', handleKeydown);
  }, [handleUpdateSlide]);

  return (
    <MainViewWrapper>
      <Header />
      <BibleContent />
    </MainViewWrapper>
  );
};

export default MainView;
