"""split_couplet_content

Revision ID: 8c4cb5b715cd
Revises: 0c788e686312
Create Date: 2024-06-03 13:30:42.282157

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8c4cb5b715cd'
down_revision: Union[str, None] = '0c788e686312'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('couplet_content_chords',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('chord_template', sa.String(length=32), server_default='$', nullable=False),
    sa.Column('root_note', sa.SmallInteger(), server_default='0', nullable=False),
    sa.Column('bass_note', sa.SmallInteger(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('couplet_contents',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('couplet_id', sa.String(length=36), nullable=False),
    sa.Column('chord_id', sa.String(length=36), nullable=False),
    sa.Column('text_content', sa.Text(), nullable=False),
    sa.Column('order', sa.Integer(), server_default='0', nullable=False),
    sa.Column('line', sa.Integer(), server_default='0', nullable=False),
    sa.ForeignKeyConstraint(['chord_id'], ['couplet_content_chords.id'], ),
    sa.ForeignKeyConstraint(['couplet_id'], ['couplets.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_column('couplets', 'couplet_content')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('couplets', sa.Column('couplet_content', sa.TEXT(), server_default=sa.text("('')"), nullable=False))
    op.drop_table('couplet_contents')
    op.drop_table('couplet_content_chords')
    # ### end Alembic commands ###
