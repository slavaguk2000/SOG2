import React from 'react';

import { useSubscription } from '@apollo/client';

import PsalmChordsViewByData from '../components/psalmChords/PsalmChordsViewByData';
import { activePsalmChordsSubscription } from '../utils/gql/queries';
import { Subscription } from '../utils/gql/types';

const ActivePsalmChordsPage = () => {
  const { data } = useSubscription<Pick<Subscription, 'activePsalmChordsSubscription'>>(activePsalmChordsSubscription);

  const psalmId = data?.activePsalmChordsSubscription?.psalmData?.psalm.id;

  return (
    <PsalmChordsViewByData
      fullScreenSize
      imagesPreferred
      psalmId={psalmId}
      psalmData={data?.activePsalmChordsSubscription?.psalmData}
      rootTransposition={data?.activePsalmChordsSubscription?.rootTransposition}
    />
  );
};

export default ActivePsalmChordsPage;
