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

export const bibleHistory = gql`
  query bibleHistory($bibleId: ID!, $start: Int, $size: Int) {
    bibleHistory(bibleId: $bibleId, start: $start, size: $size) {
      id
      content
      location
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

export const setFreeSlide = gql`
  mutation setFreeSlide($text: String!, $title: String!) {
    setFreeSlide(text: $text, title: $title)
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
