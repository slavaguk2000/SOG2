from ariadne import gql

type_defs = gql("""
    enum TabType {
      Bible
      Sermon
    }

    type Query {
        search(searchPattern: String!, tabType: TabType!): [Slide!]!
        bibleBooks(bibleId: ID!): [BibleBook!]!
        bibleVerses(bibleId: ID!, bookId: ID!, chapter: Int!): [Slide!]!
        bibleHistory(bibleId: ID!, start: Int, size: Int): [Slide!]!
        sermon(sermonId: ID!): [Slide!]!
        sermons(sermonsCollectionId: ID!): [Sermon!]!
    }

    type Slide {
        id: ID
        location: [String!]
        content: String!
        searchContent: String
        title: String
    }

    type SlideLocation {
        location: [String!]!
    }
    
    type BibleBook {
        id: ID!
        name: String!
        chapterCount: Int!
    }
    
    type Sermon {
        id: ID!
        name: String!
        translation: String!
        date: String!
        audioLink: String
    }
    
    type Mutation {
      setActiveSlide(slideId: ID): Boolean
      setFreeSlide(text: String!, title: String!): Boolean
    }
    
    type Subscription {
      activeSlideSubscription: Slide
    }
""")
