import React, { Context, FC, PropsWithChildren, useContext, useEffect } from 'react';

import Header from 'src/components/header';

import { useInstrumentsField } from '../../providers/instrumentsFieldProvider';
import { DataProvider } from '../../providers/types';

import { MainViewWrapper } from './styled';

interface MainViewProps extends PropsWithChildren {
  dataProviderContext: Context<DataProvider>;
}

const MainView: FC<MainViewProps> = ({ children, dataProviderContext }) => {
  const { currentSlide } = useInstrumentsField();

  const { handleUpdateSlide, lastSlide, handlePrevSlide, handleNextSlide } =
    useContext<DataProvider>(dataProviderContext);

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
      {children}
    </MainViewWrapper>
  );
};

export default MainView;
