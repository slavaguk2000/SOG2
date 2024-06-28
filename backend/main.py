from ariadne import make_executable_schema, snake_case_fallback_resolvers
from ariadne.asgi import GraphQL
from starlette.applications import Starlette
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Mount
from starlette.staticfiles import StaticFiles

from src.typedefs.main_typedefs import type_defs
from src.resolvers.resolvers import resolvers


IMAGE_DIRECTORY = "psalms_images/songs_books"

schema = make_executable_schema(type_defs, resolvers, snake_case_fallback_resolvers)
graphql_app = GraphQL(schema, debug=True)


routes = [
    Mount("/", graphql_app, name="/"),
    Mount("/psalm-image", StaticFiles(directory=IMAGE_DIRECTORY), name="static")
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
    uvicorn.run(app, host="0.0.0.0", port=8000)
