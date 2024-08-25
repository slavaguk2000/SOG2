import React from 'react';

import { Collapse, Tooltip } from '@mui/material';

import { useFavouriteData } from '../../../providers/dataProviders/psalmsDataProvider/FavouriteProvider';
import { PsalmsBook } from '../../../utils/gql/types';
import PsalmsBookAvatar from '../common/PsalmsBookAvatar';

import { usePsalmBooksContextMenu } from './PsalmBooksContextMenuProvider';
import { PsalmBookItemWrapper } from './styled';

interface PsalmBookItemProps {
  psalmsBookData?: PsalmsBook;
  selected?: boolean;
  onClick?: () => void;
}

const PsalmBookItem = ({ psalmsBookData, selected, onClick }: PsalmBookItemProps) => {
  const { favouritePsalmsData } = useFavouriteData();
  const { handleContextMenu } = usePsalmBooksContextMenu();
  const isFavourite = !!psalmsBookData?.isFavourite;

  const psalmsCount = isFavourite ? favouritePsalmsData.length : psalmsBookData?.psalmsCount;

  return (
    <Collapse timeout={1000} in={!!psalmsCount}>
      {psalmsBookData && (
        <Tooltip placement="right" title={isFavourite ? 'Favourite' : psalmsBookData.name ?? 'Unknown'}>
          <PsalmBookItemWrapper selected={selected} onClick={onClick}>
            <PsalmsBookAvatar
              name={psalmsBookData.name}
              isFavourite={isFavourite}
              iconSrc={psalmsBookData?.iconSrc ?? undefined}
              onContextMenu={isFavourite ? undefined : (e) => handleContextMenu(e, psalmsBookData.id)}
            />
          </PsalmBookItemWrapper>
        </Tooltip>
      )}
    </Collapse>
  );
};

export default PsalmBookItem;
