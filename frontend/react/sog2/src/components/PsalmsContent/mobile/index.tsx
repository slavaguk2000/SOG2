import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import { psalms } from '../../../utils/gql/queries';
import { PsalmsSortingKeys, Query, QueryPsalmsArgs, SortingDirection } from '../../../utils/gql/types';

import PsalmsContentMobileFooter from './Footer';
import PsalmsContentMobileHeader from './Header';
import PsalmsList from './PsalmsList';
import { PsalmsContentMobileWrapper } from './styled';

const PsalmsContentMobile = () => {
  const [searchParams] = useSearchParams();
  const psalmsBookId = searchParams.get('psalmsBookId') ?? '';
  const { data: psalmsQueryData } = useQuery<Pick<Query, 'psalms'>, QueryPsalmsArgs>(psalms, {
    variables: {
      psalmsBookId,
      psalmsSorting: {
        sortingKey: PsalmsSortingKeys.Number,
        sortDirection: SortingDirection.Asc,
      },
    },
    fetchPolicy: 'cache-first',
    skip: !psalmsBookId,
  });

  const length = psalmsQueryData?.psalms.length ?? 0;

  const memoLength = useMemo(() => length, [length]);

  return (
    <PsalmsContentMobileWrapper>
      <PsalmsContentMobileHeader />
      <PsalmsList listSize={memoLength} />
      <PsalmsContentMobileFooter />
    </PsalmsContentMobileWrapper>
  );
};

export default PsalmsContentMobile;
