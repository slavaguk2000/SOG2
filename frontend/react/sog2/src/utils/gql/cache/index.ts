import { InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    Slide: {
      fields: {
        searchContent: {
          merge(existing, incoming) {
            return incoming ?? existing;
          },
        },
      },
    },
  },
});

export default cache;
