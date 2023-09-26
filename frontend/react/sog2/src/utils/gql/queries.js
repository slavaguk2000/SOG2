import { gql } from '@apollo/client';

export const search = gql`
  query search($searchPattern: String!) {
    search(searchPattern: $searchPattern) {
      id
      content
      location
      searchContent
    }
  }
`;

export const bibleBooks = gql`
  query bibleBooks($bibleId: ID!) {
    bibleBooks(bibleId: $bibleId) {
      id
      name
      chapterCount
    }
  }
`;

export const bibleVerses = gql`
  query bibleVerses($bibleId: ID!, $bookId: ID!, $chapter: Int!) {
    bibleVerses(bibleId: $bibleId, bookId: $bookId, chapter: $chapter) {
      id
      content
      location
      searchContent
    }
  }
`;

export const setActiveSlide = gql`
  mutation setActiveSlide($slideId: ID) {
    setActiveSlide(slideId: $slideId)
  }
`;

export const ActiveSlideSubscription = gql`
  subscription ActiveSlideSubscription {
    activeSlideSubscription {
      id
      content
      location
      searchContent
    }
  }
`;
