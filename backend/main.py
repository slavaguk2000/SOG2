from ariadne import make_executable_schema, snake_case_fallback_resolvers
from ariadne.asgi import GraphQL
from starlette.applications import Starlette
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Mount
from starlette.staticfiles import StaticFiles

from src.services.parsers.psalmsParsers.utils import IMAGE_DIRECTORY
from src.typedefs.main_typedefs import type_defs
from src.resolvers.resolvers import resolvers


schema = make_executable_schema(type_defs, resolvers, snake_case_fallback_resolvers)
graphql_app = GraphQL(schema, debug=True)


routes = [
    Mount("/psalm-image", StaticFiles(directory=IMAGE_DIRECTORY), name="static"),
    Mount("/", graphql_app, name="/")
]

app = Starlette(routes=routes)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True, log_level='debug')
