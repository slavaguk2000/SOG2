python3 -m venv venv
venv/bin/python3 -m pip install ariadne starlette elasticsearch singleton_decorator "uvicorn[standard]" sqlalchemy alembic regex bs4
venv/bin/python3 -m alembic upgrade head
