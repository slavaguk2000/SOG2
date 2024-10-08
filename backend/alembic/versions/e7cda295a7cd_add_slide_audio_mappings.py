"""add slide audio mappings

Revision ID: e7cda295a7cd
Revises: b6e5be02855c
Create Date: 2024-02-13 05:20:30.387663

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e7cda295a7cd'
down_revision: Union[str, None] = 'b6e5be02855c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('slide_audio_mappings',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('slide_collection_audio_mapping_id', sa.String(length=36), nullable=False),
    sa.Column('time_point', sa.Integer(), nullable=False),
    sa.Column('chars_offset', sa.Integer(), server_default='0', nullable=False),
    sa.Column('slide_id', sa.String(length=36), nullable=False),
    sa.ForeignKeyConstraint(['slide_collection_audio_mapping_id'], ['sermon_audio_mappings.id'], ),
    sa.ForeignKeyConstraint(['slide_id'], ['paragraphs.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('slide_audio_mappings')
    # ### end Alembic commands ###
