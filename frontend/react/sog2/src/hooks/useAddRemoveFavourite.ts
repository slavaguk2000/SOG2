import { ApolloCache, useMutation } from '@apollo/client';

import { addPsalmToFavourite, PSALMS_BOOK_FRAGMENT, removePsalmFromFavourite } from '../utils/gql/queries';
import {
  Mutation,
  MutationAddPsalmToFavouriteArgs,
  MutationRemovePsalmFromFavouriteArgs,
  PsalmsBook,
} from '../utils/gql/types';

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

const useAddRemoveFavourite = ({
  favouriteBookId,
  psalmId,
  transposition,
}: {
  favouriteBookId?: string;
  psalmId: string;
  transposition: number;
}) => {
  const favouriteBookCacheId = favouriteBookId && `PsalmsBook:${favouriteBookId}`;
  const psalmCacheId = `PsalmsBookItem:${favouriteBookId}${psalmId}`;

  const commonOptions = {
    variables: {
      psalmId,
      transposition,
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

  return {
    addPsalmToFavouriteMutation,
    removePsalmFromFavouriteMutation,
  };
};

export default useAddRemoveFavourite;
