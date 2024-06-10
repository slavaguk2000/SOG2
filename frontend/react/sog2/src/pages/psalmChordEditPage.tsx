import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import PsalmChordsEdit from '../components/psalmChordsEdit';
import EditableChordsDataProvider from '../components/psalmChordsEdit/editableChordsDataProvider';
import { psalm } from '../utils/gql/queries';
import { Query, QueryPsalmArgs } from '../utils/gql/types';

const PsalmChordEditPage = () => {
  const [searchParams] = useSearchParams();
  const psalmId = searchParams.get('psalmId') ?? '';
  const navigate = useNavigate();

  const { data: currentPsalmData, loading } = useQuery<Pick<Query, 'psalm'>, QueryPsalmArgs>(psalm, {
    variables: {
      psalmId,
    },
    fetchPolicy: 'cache-first',
    skip: !psalmId,
  });

  useEffect(() => {
    if (!(loading || currentPsalmData)) {
      navigate('/psalms');
    }
  }, [currentPsalmData, loading, navigate]);

  return (
    currentPsalmData && (
      <EditableChordsDataProvider initialData={currentPsalmData.psalm}>
        <PsalmChordsEdit />
      </EditableChordsDataProvider>
    )
  );
};

export default PsalmChordEditPage;
