import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import PsalmChordsEdit from '../components/psalmChords';
import EditableChordsDataProvider from '../components/psalmChords/editableChordsDataProvider';
import { psalm } from '../utils/gql/queries';
import { Query, QueryPsalmArgs } from '../utils/gql/types';

const PsalmChordEditPage = () => {
  const [searchParams] = useSearchParams();
  const psalmId = searchParams.get('psalmId') ?? '';
  const transpositionString = searchParams.get('transposition');
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

  const initialData = useMemo(
    () =>
      currentPsalmData && {
        id: currentPsalmData.psalm.id,
        psalm: currentPsalmData.psalm.psalm,
        couplets: currentPsalmData.psalm.couplets.map(({ couplet }) => couplet),
      },
    [currentPsalmData],
  );

  const transposition = useMemo(
    () => (isNaN(transpositionString as unknown as number) ? 0 : Number(transpositionString)),
    [transpositionString],
  );

  return (
    initialData && (
      <EditableChordsDataProvider initialData={initialData} rootTransposition={transposition}>
        <PsalmChordsEdit />
      </EditableChordsDataProvider>
    )
  );
};

export default PsalmChordEditPage;
