"""add sermon initial data

Revision ID: 93f1dc1961f2
Revises: 12b9bef38048
Create Date: 2024-01-29 00:06:59.085035

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '93f1dc1961f2'
down_revision: Union[str, None] = '12b9bef38048'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('sermons',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('translation', sa.String(), nullable=False),
    sa.Column('language', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('paragraphs',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('sermon_id', sa.String(length=36), nullable=False),
    sa.Column('paragraph_order', sa.Integer(), nullable=False),
    sa.Column('chapter', sa.Integer(), nullable=True),
    sa.Column('content', sa.Text(), nullable=False),
    sa.ForeignKeyConstraint(['sermon_id'], ['sermons.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('sermon_audio_mappings',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('sermon_id', sa.String(length=36), nullable=False),
    sa.Column('audio_link', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['sermon_id'], ['sermons.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('sermon_audio_mappings')
    op.drop_table('paragraphs')
    op.drop_table('sermons')
    # ### end Alembic commands ###