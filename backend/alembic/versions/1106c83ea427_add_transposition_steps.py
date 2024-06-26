"""add transposition_steps

Revision ID: 1106c83ea427
Revises: 8c4cb5b715cd
Create Date: 2024-06-13 08:31:19.308190

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1106c83ea427'
down_revision: Union[str, None] = '8c4cb5b715cd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('psalms_book_psalms', sa.Column('transposition_steps', sa.Integer(), server_default='0', nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('psalms_book_psalms', 'transposition_steps')
    # ### end Alembic commands ###
