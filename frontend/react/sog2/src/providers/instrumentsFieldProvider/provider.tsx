import React, { FC, PropsWithChildren, SetStateAction, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useMutation } from '@apollo/client';

import { setActiveSlide } from '../../utils/gql/queries';
import { Mutation, MutationSetActiveSlideArgs, TabType } from '../../utils/gql/types';
import { usePresentation } from '../presentationProvider';
import { SlideData } from '../types';

import InstrumentsFieldProviderContext from './context';

const InstrumentsFieldProvider: FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation();
  const [silentMode, setSilentMode] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<SlideData | undefined>(undefined);

  const { setText } = usePresentation();

  const [setActiveSlideMutation] = useMutation<Pick<Mutation, 'setActiveSlide'>, MutationSetActiveSlideArgs>(
    setActiveSlide,
  );

  const tabType = pathname === '/bible' ? TabType.Bible : TabType.Sermon;

  const sendActiveSlide = (newSlideData?: SlideData) => {
    setActiveSlideMutation({
      variables: {
        slideId: newSlideData?.slide?.id,
        type: tabType,
        slideAudioMapping: newSlideData?.slideAudioMapping,
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
    sendActiveSlide(newSlide);
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
    if (
      (currentSlide?.slide?.id && currentSlide.slide.id === newSlide?.slide?.id) ||
      (currentSlide?.slide && currentSlide.slide.content === newSlide?.slide?.content) ||
      (currentSlide?.presentationData &&
        currentSlide.presentationData.title === newSlide?.presentationData?.title &&
        currentSlide.presentationData.text === newSlide?.presentationData?.text)
    ) {
      return;
    }

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
