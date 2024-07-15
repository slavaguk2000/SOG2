import React, { FC, PropsWithChildren, SetStateAction, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useMutation } from '@apollo/client';

import { multiScreenShowTabTypes } from '../../constants/behaviorConstants';
import { setActiveSlide, setActiveSlideOffset } from '../../utils/gql/queries';
import { Mutation, MutationSetActiveSlideArgs, MutationSetActiveSlideOffsetArgs, TabType } from '../../utils/gql/types';
import { useAudioMapping } from '../AudioMapping/provider';
import { usePresentation } from '../presentationProvider';
import { SlideData } from '../types';

import InstrumentsFieldProviderContext from './context';

const InstrumentsFieldProvider: FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation();
  const [silentMode, setSilentMode] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<SlideData | undefined>(undefined);

  const { setText } = usePresentation();
  const { recording: mappingRecording } = useAudioMapping();

  const [setActiveSlideMutation] = useMutation<Pick<Mutation, 'setActiveSlide'>, MutationSetActiveSlideArgs>(
    setActiveSlide,
  );

  const [setActiveSlideOffsetMutation] = useMutation<
    Pick<Mutation, 'setActiveSlideOffset'>,
    MutationSetActiveSlideOffsetArgs
  >(setActiveSlideOffset);

  const tabType = pathname === '/bible' ? TabType.Bible : pathname === '/sermon' ? TabType.Sermon : TabType.Psalm;

  const sendActiveSlide = (newSlideData?: SlideData) => {
    setActiveSlideMutation({
      variables: {
        slideId: newSlideData?.slide?.id,
        type: tabType,
        slideAudioMapping: mappingRecording ? newSlideData?.slideAudioMapping : undefined,
      },
      refetchQueries: mappingRecording ? ['sermon'] : [],
    }).catch((e) => console.error(e));
  };

  const handleUpdateCurrentSlideOffset = (screenOffset: number, timePoint: number) => {
    if (currentSlide?.slide?.id && currentSlide?.slideAudioMapping) {
      setActiveSlideOffsetMutation({
        variables: {
          slideId: currentSlide.slide.id,
          type: tabType,
          slideAudioMapping: mappingRecording ? { ...currentSlide.slideAudioMapping, timePoint } : undefined,
          offset: screenOffset,
        },
        refetchQueries: mappingRecording ? ['sermon'] : [],
      }).catch((e) => console.error(e));
    }
  };

  const updateSlideOnPresentation = (newSlide?: SlideData, options: { currentLastUp?: boolean } = {}) => {
    if (!newSlide) {
      setText('', '');

      return;
    }

    setText(newSlide.presentationData.text, newSlide.presentationData.title, {
      ...options,
      multiScreenShow: multiScreenShowTabTypes.includes(tabType),
    });
  };

  const updatePresentationAndBackendSlide = (newSlide?: SlideData, options: { currentLastUp?: boolean } = {}) => {
    sendActiveSlide(newSlide);
    updateSlideOnPresentation(newSlide, options);
  };

  const handleSetSilentMode = (setter: SetStateAction<boolean>) => {
    setSilentMode((prev) => {
      const newMode = typeof setter === 'function' ? setter(prev) : setter;

      updatePresentationAndBackendSlide(newMode ? undefined : currentSlide);

      return newMode;
    });
  };

  const handleUpdateSlide = (newSlide?: SlideData, options: { currentLastUp?: boolean } = {}) => {
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
      updatePresentationAndBackendSlide(newSlide, options);
    }
  };

  return (
    <InstrumentsFieldProviderContext.Provider
      value={{
        silentMode,
        setSilentMode: handleSetSilentMode,
        handleUpdateSlide,
        currentSlide: currentSlide?.slide,
        handleUpdateCurrentSlideOffset,
      }}
    >
      {children}
    </InstrumentsFieldProviderContext.Provider>
  );
};

export default InstrumentsFieldProvider;
