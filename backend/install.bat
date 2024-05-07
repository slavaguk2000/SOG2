python -m venv venv
venv\Scripts\python.exe -m pip install ariadne starlette elasticsearch singleton_decorator "uvicorn[standard]" sqlalchemy alembic regex
venv\Scripts\python.exe -m  alembic upgrade head
