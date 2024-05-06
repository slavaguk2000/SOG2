"""add space offset

Revision ID: d69a8612c981
Revises: e7cda295a7cd
Create Date: 2024-05-05 00:04:51.400099

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd69a8612c981'
down_revision: Union[str, None] = 'e7cda295a7cd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('slide_audio_mappings', sa.Column('space_offset', sa.Float(), server_default='0', nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('slide_audio_mappings', 'space_offset')
    # ### end Alembic commands ###
