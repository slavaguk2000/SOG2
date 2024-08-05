import React from 'react';

import { useSubscription } from '@apollo/client';

import FullSpaceSlide from '../components/FullSpaceSlide';
import { ActiveSlideSubscription } from '../utils/gql/queries';
import { Subscription } from '../utils/gql/types';

const ActiveSlidePage = () => {
  const { data } = useSubscription<Pick<Subscription, 'activeSlideSubscription'>>(ActiveSlideSubscription);

  const slide = data?.activeSlideSubscription;

  return (
    <FullSpaceSlide
      content={`${slide?.contentPrefix ?? ''}${slide?.content ?? ''}`}
      title={slide?.title ?? ''}
      minTitleFontSize={1}
      maxTitleFontSize={3}
      maxContentFontSize={10}
    />
  );
};

export default ActiveSlidePage;
