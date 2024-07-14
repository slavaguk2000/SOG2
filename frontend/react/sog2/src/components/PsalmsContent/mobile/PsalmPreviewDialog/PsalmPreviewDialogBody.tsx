import React from 'react';

import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';

import { psalm } from '../../../../utils/gql/queries';
import { Query, QueryPsalmArgs } from '../../../../utils/gql/types';
import PsalmChordsViewByData from '../../../psalmChords/PsalmChordsViewByData';
import FavouriteIconButton from '../../common/InFavouriteIconButton';

import { PsalmPreviewDialogBodyWrapper } from './styled';

interface PsalmPreviewDialogBodyProps {
  psalmId: string;
  transposition: number;
}

const PsalmPreviewDialogBody = ({ psalmId, transposition }: PsalmPreviewDialogBodyProps) => {
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
          rootTransposition={transposition}
        />
      )}
      <Box position="absolute" right={0}>
        <FavouriteIconButton psalmId={psalmId} transposition={transposition} />
      </Box>
    </PsalmPreviewDialogBodyWrapper>
  );
};

export default PsalmPreviewDialogBody;
