import React from 'react';

import { useSubscription } from '@apollo/client';

import EditableChordsDataProvider from '../components/psalmChords/editableChordsDataProvider';
import PsalmChordsView from '../components/psalmChords/PsalmChordsView';
import { activePsalmChordsSubscription } from '../utils/gql/queries';
import { Subscription } from '../utils/gql/types';

const ActivePsalmChordsPage = () => {
  const { data } = useSubscription<Pick<Subscription, 'activePsalmChordsSubscription'>>(activePsalmChordsSubscription);

  return (
    data?.activePsalmChordsSubscription?.psalmData && (
      <EditableChordsDataProvider
        forceData={data.activePsalmChordsSubscription.psalmData}
        initialData={data.activePsalmChordsSubscription.psalmData}
        rootTransposition={data.activePsalmChordsSubscription?.rootTransposition ?? undefined}
      >
        <PsalmChordsView />
      </EditableChordsDataProvider>
    )
  );
};

export default ActivePsalmChordsPage;