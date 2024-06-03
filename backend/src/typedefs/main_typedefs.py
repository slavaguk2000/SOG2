from ariadne import gql

type_defs = gql("""
    enum TabType {
      Bible
      Sermon
    }
    
    enum MusicalKey {
        C
        CSharp
        Db
        D
        DSharp
        Eb
        E
        F
        FSharp
        Gb
        G
        GSharp
        Ab
        A
        ASharp
        Bb
        B
    }
    
    enum SortingDirection {
      ASC
      DESC
    }
    
    enum PsalmsSortingKeys {
      NAME
      NUMBER
    }
    
    input PsalmsSorting {
        sortingKey: PsalmsSortingKeys!,
        sortDirection: SortingDirection!
    }

    type Query {
        search(searchPattern: String!, tabType: TabType!, id: ID): [Slide!]!
        bibleBooks(bibleId: ID!): [BibleBook!]!
        bibleVerses(bibleId: ID!, bookId: ID!, chapter: Int!): [Slide!]!
        bibleHistory(bibleId: ID!, start: Int, size: Int): [Slide!]!
        sermon(sermonId: ID!): [Slide!]!
        sermons(sermonsCollectionId: ID!): [Sermon!]!
        psalmsBooks: [PsalmsBook!]!
        psalms(psalmsBookId: ID!, psalmsSorting: PsalmsSorting): [Psalm!]!
        psalm(psalmId: ID!): PsalmData!
    }
    
    type PsalmsBook {
        id: ID!
        name: String!
        iconSrc: String
        isFavourite: Boolean
        psalmsCount: Int!
    }
    
    type Psalm {
        id: ID!
        name: String!
        psalmNumber: String
        coupletsOrder: String
        defaultTonality: MusicalKey
    }
    
    type PsalmData {
        psalm: Psalm!
        couplets: [Couplet!]!
    }
    
    type CoupletContent {
        id: ID!
        text: String!
        line: Int!
        chord: CoupletContentChord!
    }
    
    type CoupletContentChord {
        id: ID!
        rootNote: Int!
        bassNote: Int
        chordTemplate: String!
    }
    
    type Couplet {
        id: ID!
        marker: String!
        initialOrder: Int!
        coupletContent: [CoupletContent!]!
        slide: Slide!
    }
    
    type SlideAudioMapping {
        id: ID
        slideCollectionAudioMappingId: ID
        timePoint: Int
        spaceOffset: Float
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
      setActiveSlideOffset(slideId: ID!, type: TabType!, slideAudioMapping: SlideMappingInput, offset: Float!): Boolean
      setFreeSlide(text: String!, title: String!): Boolean
      addBibleFromSog(sogFileSrc: String!, language: String!, translation: String!): Boolean
      syncBibleToElastic(bibleId: ID): Boolean
      syncSermonsToElastic: Boolean
      parseSermonsFromBranhamRu: Boolean
      addPsalmsFromSog(sogFileSrc: String!, language: String!): Boolean
      addPsalmToFavourite(psalmId: ID): Boolean
      removePsalmFromFavourite(psalmId: ID): Boolean
    }
    
    type Subscription {
      activeSlideSubscription: Slide
    }
""")
