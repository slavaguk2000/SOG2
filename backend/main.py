from ariadne import make_executable_schema, snake_case_fallback_resolvers
from ariadne.asgi import GraphQL
from src.typedefs.main_typedefs import type_defs
from src.resolvers.resolvers import resolvers

schema = make_executable_schema(type_defs, resolvers, snake_case_fallback_resolvers)
app = GraphQL(schema, debug=True)
