from ariadne import gql

type_defs = gql("""
    enum TabType {
      Bible
      Sermon
      Psalm
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
        psalms(psalmsBookId: ID!, psalmsSorting: PsalmsSorting): [PsalmsBookItem!]!
        psalm(psalmId: ID!): PsalmDataWithSlides!
    }
    
    type PsalmsBook {
        id: ID!
        name: String!
        iconSrc: String
        isFavourite: Boolean
        psalmsCount: Int!
    }
    
    type PsalmsBookItem {
        id: ID!
        psalm: Psalm!
        transpositionSteps: Int!
    }
    
    type Psalm {
        id: ID!
        name: String!
        psalmNumber: String
        coupletsOrder: String
        defaultTonality: MusicalKey
    }
    
    type PsalmData {
        id: ID!
        psalm: Psalm!
        couplets: [Couplet!]!
    }
    
    type SubscriptingPsalmData {
        psalmData: PsalmData
        rootTransposition: Int
    }
    
    type PsalmDataWithSlides {
        id: ID!
        psalm: Psalm!
        couplets: [CoupletWithSlide!]!
    }
    
    input PsalmInput {
        id: ID!
        name: String!
        psalmNumber: String
        coupletsOrder: String
        defaultTonality: MusicalKey
    }
    
    input PsalmDataInput {
        psalm: PsalmInput!
        couplets: [CoupletInput!]!
    }
    
    type CoupletContent {
        id: ID!
        text: String!
        line: Int!
        chord: CoupletContentChord!
    }
    
    input CoupletContentInput {
        id: ID!
        text: String!
        line: Int!
        chord: CoupletContentChordInput!
    }
    
    type CoupletContentChord {
        id: ID!
        rootNote: Int!
        bassNote: Int
        chordTemplate: String!
    }
    
    input CoupletContentChordInput {
        id: ID!
        rootNote: Int!
        bassNote: Int
        chordTemplate: String!
    }
    
    type CoupletWithSlide {
        id: ID!
        couplet: Couplet!
        slide: Slide!
    }
    
    type Couplet {
        id: ID!
        marker: String!
        initialOrder: Int!
        coupletContent: [CoupletContent!]!
    }
    
    input CoupletInput {
        id: ID!
        marker: String!
        initialOrder: Int!
        coupletContent: [CoupletContentInput!]!
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
        contentPrefix: String
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
      setActivePsalm(psalmId: ID, psalmsBookId: ID, transposition: Int): Boolean
      setActiveSlideOffset(slideId: ID!, type: TabType!, slideAudioMapping: SlideMappingInput, offset: Float!): Boolean
      setFreeSlide(text: String!, title: String!): Boolean
      addBibleFromSog(sogFileSrc: String!, language: String!, translation: String!): Boolean
      syncBibleToElastic(bibleId: ID): Boolean
      syncSermonsToElastic: Boolean
      syncPsalmsToElastic: Boolean
      parseSermonsFromBranhamRu: Boolean
      addPsalmsFromSog(sogFileSrc: String!, language: String!): Boolean
      deletePsalmBook(psalmBookId: ID!): Boolean
      addPsalmToFavourite(psalmId: ID!, transposition: Int): Boolean
      removePsalmFromFavourite(psalmId: ID!): Boolean
      updatePsalm(psalmData: PsalmDataInput!): PsalmData!
      updatePsalmTransposition(psalmsBookId: ID!, psalmId: ID!, transposition: Int!): PsalmsBookItem!
    }
    
    type Subscription {
      activeSlideSubscription: Slide
      activePsalmChordsSubscription: SubscriptingPsalmData
    }
""")
