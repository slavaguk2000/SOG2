"""add psalms to db

Revision ID: 21c771768c35
Revises: d69a8612c981
Create Date: 2024-05-18 17:28:40.505732

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '21c771768c35'
down_revision: Union[str, None] = 'd69a8612c981'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('psalm_books',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('language', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('psalms',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('psalm_number', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('default_tonality', sa.Enum('C', 'CSharp', 'Db', 'D', 'DSharp', 'Eb', 'E', 'F', 'FSharp', 'Gb', 'G', 'GSharp', 'Ab', 'A', 'ASharp', 'Bb', 'B', name='musicalkey'), nullable=True),
    sa.Column('couplets_order', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('couplets',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('psalm_id', sa.String(length=36), nullable=False),
    sa.Column('marker', sa.String(), nullable=False),
    sa.Column('couplet_content', sa.Text(), nullable=False),
    sa.Column('initial_order', sa.Integer(), server_default='0', nullable=False),
    sa.ForeignKeyConstraint(['psalm_id'], ['psalms.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('psalms_book_psalms',
    sa.Column('psalms_book_id', sa.String(length=36), nullable=True),
    sa.Column('psalm_id', sa.String(length=36), nullable=True),
    sa.ForeignKeyConstraint(['psalm_id'], ['psalms.id'], ),
    sa.ForeignKeyConstraint(['psalms_book_id'], ['psalm_books.id'], )
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('psalms_book_psalms')
    op.drop_table('couplets')
    op.drop_table('psalms')
    op.drop_table('psalm_books')
    # ### end Alembic commands ###
