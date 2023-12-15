import React, { FC, PropsWithChildren, SetStateAction, useState } from 'react';

import { useMutation } from '@apollo/client';

import { setActiveSlide } from '../../utils/gql/queries';
import { Mutation, MutationSetActiveSlideArgs, Slide } from '../../utils/gql/types';
import { usePresentation } from '../presentationProvider';
import { SlideData } from '../types';

import InstrumentsFieldProviderContext from './context';

const InstrumentsFieldProvider: FC<PropsWithChildren> = ({ children }) => {
  const [silentMode, setSilentMode] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<SlideData | undefined>(undefined);

  const { setText } = usePresentation();

  const [setActiveSlideMutation] = useMutation<Pick<Mutation, 'setActiveSlide'>, MutationSetActiveSlideArgs>(
    setActiveSlide,
  );

  const sendActiveSlide = (newSlide?: Slide) => {
    setActiveSlideMutation({
      variables: {
        slideId: newSlide?.id,
      },
    }).catch((e) => console.error(e));
  };

  const updateSlideOnPresentation = (newSlide?: SlideData) => {
    if (!newSlide) {
      setText('', '');

      return;
    }

    setText(newSlide.presentationData.text, newSlide.presentationData.title);
  };

  const updatePresentationAndBackendSlide = (newSlide?: SlideData) => {
    sendActiveSlide(newSlide?.slide);
    updateSlideOnPresentation(newSlide);
  };

  const handleSetSilentMode = (setter: SetStateAction<boolean>) => {
    setSilentMode((prev) => {
      const newMode = typeof setter === 'function' ? setter(prev) : setter;

      updatePresentationAndBackendSlide(newMode ? undefined : currentSlide);

      return newMode;
    });
  };

  const handleUpdateSlide = (newSlide?: SlideData) => {
    setCurrentSlide(newSlide);

    if (!silentMode) {
      updatePresentationAndBackendSlide(newSlide);
    }
  };

  return (
    <InstrumentsFieldProviderContext.Provider
      value={{
        silentMode,
        setSilentMode: handleSetSilentMode,
        handleUpdateSlide,
        currentSlide: currentSlide?.slide,
      }}
    >
      {children}
    </InstrumentsFieldProviderContext.Provider>
  );
};

export default InstrumentsFieldProvider;
