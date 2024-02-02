"""init version

Revision ID: e9e4960cbd8e
Revises: 
Create Date: 2024-01-28 03:57:38.816256

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e9e4960cbd8e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('bibles',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('translation', sa.String(), nullable=False),
    sa.Column('language', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bible_books',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('bible_id', sa.String(length=36), nullable=False),
    sa.Column('book_order', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('chapters_count', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['bible_id'], ['bibles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('verses',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('bible_id', sa.String(length=36), nullable=False),
    sa.Column('bible_book_id', sa.String(length=36), nullable=False),
    sa.Column('chapter', sa.Integer(), nullable=False),
    sa.Column('verse_number', sa.Integer(), nullable=False),
    sa.Column('verse_content', sa.Text(), nullable=False),
    sa.ForeignKeyConstraint(['bible_book_id'], ['bible_books.id'], ),
    sa.ForeignKeyConstraint(['bible_id'], ['bibles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('verses')
    op.drop_table('bible_books')
    op.drop_table('bibles')
    # ### end Alembic commands ###