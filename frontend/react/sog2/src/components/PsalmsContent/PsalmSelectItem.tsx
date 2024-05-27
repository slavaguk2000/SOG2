import React, { MouseEventHandler, useMemo, useState } from 'react';

import { ApolloCache, useMutation } from '@apollo/client';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';

import { usePsalmsData } from '../../providers/dataProviders/psalmsDataProvider';
import {
  addPsalmToFavourite,
  PSALMS_BOOK_FRAGMENT,
  PSALM_FRAGMENT,
  removePsalmFromFavourite,
} from '../../utils/gql/queries';
import {
  Mutation,
  MutationAddPsalmToFavouriteArgs,
  MutationRemovePsalmFromFavouriteArgs,
  PsalmsBook,
} from '../../utils/gql/types';
import BibleEntityItem from '../BibleContent/BibleEntityItem';

import { StyledIconButton } from './styled';

interface PsalmSelectItemProps {
  psalmName: string;
  selected: boolean;
  onClick: () => void;
  psalmId: string;
  inFavourite?: boolean;
}

const addSongsCountToPsalmBookInCache = (cache: ApolloCache<unknown>, psalmsBookId: string, songsToAdd: number) => {
  const psalmsBookData: PsalmsBook | null = cache.readFragment({
    id: psalmsBookId,
    fragment: PSALMS_BOOK_FRAGMENT,
  });

  if (psalmsBookData) {
    cache.writeFragment({
      id: psalmsBookId,
      fragment: PSALMS_BOOK_FRAGMENT,
      data: {
        ...psalmsBookData,
        psalmsCount: psalmsBookData.psalmsCount + songsToAdd,
      },
    });
  }
};

const setInFavouriteStatus = (cache: ApolloCache<unknown>, psalmId: string, inFavourite: boolean) => {
  const psalmsBookData: PsalmsBook | null = cache.readFragment({
    id: psalmId,
    fragment: PSALM_FRAGMENT,
  });

  if (psalmsBookData) {
    return cache.writeFragment({
      id: psalmId,
      fragment: PSALM_FRAGMENT,
      data: {
        ...psalmsBookData,
        inFavourite,
      },
    });
  }
};

const PsalmSelectItem = ({ psalmName, selected, onClick, inFavourite, psalmId }: PsalmSelectItemProps) => {
  const [internalFavouriteState, setInternalFavouriteState] = useState(inFavourite);
  const { psalmsBooksData } = usePsalmsData();

  const favouriteBookId = useMemo(() => psalmsBooksData?.find(({ isFavourite }) => isFavourite)?.id, [psalmsBooksData]);
  const favouriteBookCacheId = favouriteBookId && `PsalmsBook:${favouriteBookId}`;
  const psalmCacheId = `Psalm:${psalmId}`;

  const commonOptions = {
    variables: {
      psalmId,
    },
  };

  const [addPsalmToFavouriteMutation] = useMutation<
    Pick<Mutation, 'addPsalmToFavourite'>,
    MutationAddPsalmToFavouriteArgs
  >(addPsalmToFavourite, {
    ...commonOptions,
    update(cache, { data }) {
      if (favouriteBookCacheId && data?.addPsalmToFavourite) {
        addSongsCountToPsalmBookInCache(cache, favouriteBookCacheId, 1);
        setInFavouriteStatus(cache, psalmCacheId, true);
        cache.evict({
          fieldName: `psalms({"psalmsBookId":"${favouriteBookId}"})`,
        });
        cache.gc();
      }
    },
  });

  const [removePsalmFromFavouriteMutation] = useMutation<
    Pick<Mutation, 'removePsalmFromFavourite'>,
    MutationRemovePsalmFromFavouriteArgs
  >(removePsalmFromFavourite, {
    ...commonOptions,
    update(cache, { data }) {
      if (favouriteBookCacheId && data?.removePsalmFromFavourite) {
        addSongsCountToPsalmBookInCache(cache, favouriteBookCacheId, -1);
        setInFavouriteStatus(cache, psalmCacheId, false);
        cache.modify({
          fields: {
            [`psalms({"psalmsBookId":"${favouriteBookId}"})`](existingPsalms) {
              return typeof (existingPsalms as unknown[])[Symbol.iterator] === 'function'
                ? (existingPsalms as { __ref: string }[]).filter(({ __ref }) => __ref !== psalmCacheId)
                : existingPsalms;
            },
          },
        });
      }
    },
  });

  const handleFavouriteIconClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    setInternalFavouriteState((prevState) => {
      if (prevState) {
        removePsalmFromFavouriteMutation().catch(() => setInternalFavouriteState(inFavourite));
        return false;
      } else {
        addPsalmToFavouriteMutation().catch(() => setInternalFavouriteState(inFavourite));
        return true;
      }
    });
  };

  return (
    <BibleEntityItem name={psalmName} onClick={onClick} selected={selected}>
      <StyledIconButton size="small" onClick={handleFavouriteIconClick}>
        {internalFavouriteState ? <TurnedInIcon /> : <TurnedInNotIcon />}
      </StyledIconButton>
    </BibleEntityItem>
  );
};

export default PsalmSelectItem;
