from ariadne import gql

type_defs = gql("""
    type Query {
        search(searchPattern: String!): [Slide!]!
        bibleBooks(bibleId: ID!): [BibleBook!]!
        bibleVerses(bibleId: ID!, bookId: ID!, chapter: Int!): [Slide!]!
    }

    type Slide {
        location: [String!]!
        content: String!
        searchContent: String!
    }
    
    type BibleBook {
        id: ID!
        name: String!
        chapterCount: Int!
    }
""")
