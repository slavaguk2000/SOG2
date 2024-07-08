import React from 'react';

import { useQuery } from '@apollo/client';

import { psalm } from '../../../../utils/gql/queries';
import { Query, QueryPsalmArgs } from '../../../../utils/gql/types';
import PsalmChordsViewByData from '../../../psalmChords/PsalmChordsViewByData';

import { PsalmPreviewDialogBodyWrapper } from './styled';

interface PsalmPreviewDialogBodyProps {
  psalmId: string;
}

const PsalmPreviewDialogBody = ({ psalmId }: PsalmPreviewDialogBodyProps) => {
  const { data } = useQuery<Pick<Query, 'psalm'>, QueryPsalmArgs>(psalm, {
    variables: {
      psalmId,
    },
    fetchPolicy: 'cache-first',
  });

  const psalmData = data?.psalm;

  return (
    <PsalmPreviewDialogBodyWrapper>
      {psalmData && (
        <PsalmChordsViewByData
          imagesPreferred
          psalmId={psalmId}
          psalmData={
            psalmData && {
              id: psalmData.id,
              psalm: psalmData.psalm,
              couplets: psalmData.couplets.map(({ couplet }) => couplet),
            }
          }
        />
      )}
    </PsalmPreviewDialogBodyWrapper>
  );
};

export default PsalmPreviewDialogBody;
