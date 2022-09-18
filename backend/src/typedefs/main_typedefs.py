from ariadne import gql

type_defs = gql("""
    type Query {
        search(searchPattern: String!): [Slide!]!
    }

    type Slide {
        content: String!
    }
""")
