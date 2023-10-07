import React, { useEffect } from 'react';

import BibleContent from 'src/components/BibleContent';
import Header from 'src/components/header';
import { useBibleData } from 'src/providers/bibleDataProvider';

import { MainViewWrapper } from './styled';

const MainView = () => {
  const { handleUpdateSlide, lastSlide, currentSlide, handlePrevSlide, handleNextSlide } = useBibleData();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      e.stopPropagation();

      switch (e.key) {
        case 'ArrowUp':
          handlePrevSlide();
          e.preventDefault();
          break;
        case 'ArrowDown':
          handleNextSlide();
          e.preventDefault();
          break;
      }

      if (['Enter', 'Escape'].includes(e.key)) {
        if (e.key === 'Enter' && !currentSlide && lastSlide) {
          handleUpdateSlide(lastSlide);
        } else {
          handleUpdateSlide();
        }
      }
    };

    addEventListener('keydown', handleKeydown);

    return () => removeEventListener('keydown', handleKeydown);
  }, [currentSlide, handleNextSlide, handlePrevSlide, handleUpdateSlide, lastSlide]);

  return (
    <MainViewWrapper>
      <Header />
      <BibleContent />
    </MainViewWrapper>
  );
};

export default MainView;
