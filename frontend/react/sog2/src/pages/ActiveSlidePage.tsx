import React, { useMemo } from 'react';

import { useSubscription } from '@apollo/client';
import { Box } from '@mui/material';

import FullSpaceSlide from '../components/FullSpaceSlide';
import { ActiveSlideSubscription } from '../utils/gql/queries';
import { Slide, Subscription, SubscriptionActiveSlideSubscriptionArgs } from '../utils/gql/types';

const mappingsLanguages = (process.env.REACT_APP_MAPPING_LANGUAGES ?? '').split(',').filter((l) => l);

const ActiveSlidePage = () => {
  const { data } = useSubscription<
    Pick<Subscription, 'activeSlideSubscription'>,
    SubscriptionActiveSlideSubscriptionArgs
  >(ActiveSlideSubscription, {
    variables: {
      mappingsLanguages,
    },
  });

  const activeSlides = data?.activeSlideSubscription;

  const slides = useMemo(() => (activeSlides?.filter((slide) => slide) as Slide[]) ?? [], [activeSlides]);

  return (
    <Box
      height="100%"
      width="100%"
      display="grid"
      gridTemplateRows={`repeat(${slides.length}, ${Math.floor(100 / slides.length)}vh)`}
    >
      {slides.map((slide, idx) => (
        <FullSpaceSlide
          key={`${slide?.id ?? ''}${idx}`}
          content={`${slide?.contentPrefix ?? ''}${slide?.content ?? ''}`}
          title={slide?.title ?? ''}
          minTitleFontSize={1}
          maxTitleFontSize={3}
          maxContentFontSize={10}
          additionalRecalculateDeps={[slides.length]}
        />
      ))}
    </Box>
  );
};

export default ActiveSlidePage;
