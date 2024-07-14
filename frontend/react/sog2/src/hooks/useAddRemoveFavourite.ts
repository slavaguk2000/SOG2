import { useMutation } from '@apollo/client';

import { addPsalmToFavourite, removePsalmFromFavourite } from '../utils/gql/queries';
import { Mutation, MutationAddPsalmToFavouriteArgs, MutationRemovePsalmFromFavouriteArgs } from '../utils/gql/types';

const useAddRemoveFavourite = () => {
  const [addPsalmToFavouriteMutation] = useMutation<
    Pick<Mutation, 'addPsalmToFavourite'>,
    MutationAddPsalmToFavouriteArgs
  >(addPsalmToFavourite);

  const [removePsalmFromFavouriteMutation] = useMutation<
    Pick<Mutation, 'removePsalmFromFavourite'>,
    MutationRemovePsalmFromFavouriteArgs
  >(removePsalmFromFavourite);

  return {
    addPsalmToFavouriteMutation,
    removePsalmFromFavouriteMutation,
  };
};

export default useAddRemoveFavourite;
