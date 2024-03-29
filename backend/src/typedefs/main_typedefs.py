from ariadne import gql

type_defs = gql("""
    enum TabType {
      Bible
      Sermon
    }

    type Query {
        search(searchPattern: String!, tabType: TabType!, id: ID): [Slide!]!
        bibleBooks(bibleId: ID!): [BibleBook!]!
        bibleVerses(bibleId: ID!, bookId: ID!, chapter: Int!): [Slide!]!
        bibleHistory(bibleId: ID!, start: Int, size: Int): [Slide!]!
        sermon(sermonId: ID!): [Slide!]!
        sermons(sermonsCollectionId: ID!): [Sermon!]!
    }
    
    type SlideAudioMapping {
        id: ID
        slideCollectionAudioMappingId: ID
        timePoint: Int
    }

    type Slide {
        id: ID
        location: [String!]
        content: String!
        searchContent: String
        title: String
        audioMappings: [SlideAudioMapping!]
    }

    type SlideLocation {
        location: [String!]!
    }
    
    type BibleBook {
        id: ID!
        name: String!
        chapterCount: Int!
    }
    
    type AudioMapping {
        id: ID!
        audioLink: String!
    }
    
    type Sermon {
        id: ID!
        name: String!
        translation: String!
        date: String!
        audioMapping: AudioMapping
    }
    
    input SlideMappingInput {
        slideCollectionAudioMappingId: ID!
        timePoint: Int!
    }
    
    type Mutation {
      setActiveSlide(slideId: ID, type: TabType, slideAudioMapping: SlideMappingInput): Boolean
      setFreeSlide(text: String!, title: String!): Boolean
      addBibleFromSog(sogFileSrc: String!, language: String!, translation: String!): Boolean
      syncBibleToElastic(bibleId: ID): Boolean
      syncSermonsToElastic: Boolean
      parseSermonsFromBranhamRu: Boolean
    }
    
    type Subscription {
      activeSlideSubscription: Slide
    }
""")
