import { useMutation } from '@apollo/client';

import { addPsalmToFavourite, removePsalmFromFavourite } from '../utils/gql/queries';
import { Mutation, MutationAddPsalmToFavouriteArgs, MutationRemovePsalmFromFavouriteArgs } from '../utils/gql/types';

const useAddRemoveFavourite = ({
  psalmId,
  psalmsBookId,
  transposition,
}: {
  psalmId: string;
  psalmsBookId?: string;
  transposition?: number;
}) => {
  const commonOptions = {
    variables: {
      psalmId,
      psalmsBookId,
      transposition,
    },
  };

  const [addPsalmToFavouriteMutation] = useMutation<
    Pick<Mutation, 'addPsalmToFavourite'>,
    MutationAddPsalmToFavouriteArgs
  >(addPsalmToFavourite, commonOptions);

  const [removePsalmFromFavouriteMutation] = useMutation<
    Pick<Mutation, 'removePsalmFromFavourite'>,
    MutationRemovePsalmFromFavouriteArgs
  >(removePsalmFromFavourite, commonOptions);

  return {
    addPsalmToFavouriteMutation,
    removePsalmFromFavouriteMutation,
  };
};

export default useAddRemoveFavourite;
