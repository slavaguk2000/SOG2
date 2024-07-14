import { useMutation } from '@apollo/client';

import { arrayToMap } from '../../../../utils';
import { psalms, reorderPsalmsInPsalmsBook } from '../../../../utils/gql/queries';
import {
  Mutation,
  MutationReorderPsalmsInPsalmsBookArgs,
  PsalmsBookItem,
  Query,
  QueryPsalmsArgs,
} from '../../../../utils/gql/types';

interface ReorderPsalmsMutationProps {
  psalmsBookId?: string;
}

const useReorderPsalmsMutation = ({ psalmsBookId }: ReorderPsalmsMutationProps) => {
  const [reorderPsalmsInPsalmsBookMutation] = useMutation<
    Pick<Mutation, 'reorderPsalmsInPsalmsBook'>,
    MutationReorderPsalmsInPsalmsBookArgs
  >(reorderPsalmsInPsalmsBook);

  const handlePsalmsReorder = async (ids: string[]) => {
    if (psalmsBookId) {
      try {
        await reorderPsalmsInPsalmsBookMutation({
          variables: {
            psalmsBookId,
            psalmsIds: ids,
          },
          update: (cache) => {
            const data = cache.readQuery<Pick<Query, 'psalms'>, QueryPsalmsArgs>({
              query: psalms,
              variables: { psalmsBookId },
            });

            if (data) {
              const psalmMap = arrayToMap(data.psalms, { keyMapper: ({ psalm }) => psalm.id });

              const reorderedPsalms = ids.reduce((acc: Array<PsalmsBookItem>, id) => {
                const psalm = psalmMap[id];
                if (psalm) {
                  acc.push(psalm);
                }

                return acc;
              }, []);

              cache.writeQuery({
                query: psalms,
                variables: { psalmsBookId },
                data: {
                  psalms: reorderedPsalms,
                },
              });
            }
          },
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return {
    handlePsalmsReorder,
  };
};

export default useReorderPsalmsMutation;
