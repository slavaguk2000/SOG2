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

  const isContent = !!slides[0]?.content?.length;

  return isContent ? (
    <Box
      bgcolor="white"
      height="100%"
      width="100%"
      display="grid"
      padding="min(3vh, 3vw)"
      gap="min(1vh, 1vw)"
      boxSizing="border-box"
      gridTemplateRows={`repeat(${slides.length}, ${Math.floor(100 / slides.length)}%)`}
    >
      {slides.map((slide, idx) => (
        <FullSpaceSlide
          key={`${slide?.id ?? ''}${idx}`}
          content={`${slide?.contentPrefix ?? ''}${slide?.content ?? ''}`}
          title={slide?.title ?? ''}
          minTitleFontSize={0.5}
          maxTitleFontSize={3}
          maxContentFontSize={10}
          additionalRecalculateDeps={[slides.length]}
        />
      ))}
    </Box>
  ) : (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        background: 'url("/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom right',
      }}
    />
  );
};

export default ActiveSlidePage;
