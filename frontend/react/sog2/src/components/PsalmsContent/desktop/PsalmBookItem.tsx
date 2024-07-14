import React from 'react';

import { Collapse, Tooltip } from '@mui/material';

import { PsalmsBook } from '../../../utils/gql/types';
import PsalmsBookAvatar from '../common/PsalmsBookAvatar';

import { PsalmBookItemWrapper } from './styled';

interface PsalmBookItemProps {
  psalmsBookData?: PsalmsBook;
  selected?: boolean;
  onClick?: () => void;
}
const PsalmBookItem = ({ psalmsBookData, selected, onClick }: PsalmBookItemProps) => {
  const favourite = psalmsBookData?.isFavourite;

  return (
    <Collapse timeout={1000} in={!!psalmsBookData?.psalmsCount}>
      {psalmsBookData && (
        <Tooltip placement="right" title={favourite ? 'Favourite' : psalmsBookData.name ?? 'Unknown'}>
          <PsalmBookItemWrapper selected={selected} onClick={onClick}>
            <PsalmsBookAvatar
              name={psalmsBookData.name}
              isFavourite={!!favourite}
              iconSrc={psalmsBookData?.iconSrc ?? undefined}
            />
          </PsalmBookItemWrapper>
        </Tooltip>
      )}
    </Collapse>
  );
};

export default PsalmBookItem;
