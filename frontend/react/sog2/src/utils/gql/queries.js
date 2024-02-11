import { gql } from '@apollo/client';

export const search = gql`
  query search($searchPattern: String!, $tabType: TabType!, $id: ID) {
    search(searchPattern: $searchPattern, tabType: $tabType, id: $id) {
      id
      content
      location
      searchContent
    }
  }
`;

export const sermon = gql`
  query sermon($sermonId: ID!) {
    sermon(sermonId: $sermonId) {
      id
      content
      location
    }
  }
`;

export const sermons = gql`
  query sermons($sermonsCollectionId: ID!) {
    sermons(sermonsCollectionId: $sermonsCollectionId) {
      id
      name
      translation
      date
      audioLink
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
