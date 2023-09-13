import { gql } from '@apollo/client';

export const search = gql`
  query search($searchPattern: String!) {
    search(searchPattern: $searchPattern) {
      content
    }
  }
`;
