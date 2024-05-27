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
      audioMappings {
        id
        slideCollectionAudioMappingId
        timePoint
        spaceOffset
      }
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
      audioMapping {
        id
        audioLink
      }
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
  mutation setActiveSlide($slideId: ID, $type: TabType, $slideAudioMapping: SlideMappingInput) {
    setActiveSlide(slideId: $slideId, type: $type, slideAudioMapping: $slideAudioMapping)
  }
`;

export const setActiveSlideOffset = gql`
  mutation setActiveSlideOffset(
    $slideId: ID!
    $type: TabType!
    $slideAudioMapping: SlideMappingInput
    $offset: Float!
  ) {
    setActiveSlideOffset(slideId: $slideId, type: $type, slideAudioMapping: $slideAudioMapping, offset: $offset)
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

export const psalmsBooks = gql`
  query psalmsBooks {
    psalmsBooks {
      id
      name
      isFavourite
      iconSrc
      psalmsCount
    }
  }
`;

export const psalms = gql`
  query psalms($psalmsBookId: ID!) {
    psalms(psalmsBookId: $psalmsBookId) {
      id
      name
      psalmNumber
      coupletsOrder
      defaultTonality
      inFavourite
    }
  }
`;

export const psalm = gql`
  query psalm($psalmId: ID!) {
    psalm(psalmId: $psalmId) {
      id
      content
      searchContent
      location
    }
  }
`;

export const addPsalmToFavourite = gql`
  mutation addPsalmToFavourite($psalmId: ID) {
    addPsalmToFavourite(psalmId: $psalmId)
  }
`;

export const removePsalmFromFavourite = gql`
  mutation removePsalmFromFavourite($psalmId: ID) {
    removePsalmFromFavourite(psalmId: $psalmId)
  }
`;

export const PSALMS_BOOK_FRAGMENT = gql`
  fragment PsalmsBookFragment on PsalmsBook {
    id
    name
    isFavourite
    iconSrc
    psalmsCount
  }
`;

export const PSALM_FRAGMENT = gql`
  fragment PsalmFragment on Psalm {
    id
    name
    psalmNumber
    coupletsOrder
    defaultTonality
    inFavourite
  }
`;
