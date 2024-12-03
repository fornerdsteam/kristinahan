"""Create search_dt Calume

Revision ID: a8f7bf144469
Revises: e654541448e6
Create Date: 2024-11-28 23:42:12.528845

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a8f7bf144469'
down_revision: Union[str, None] = 'e654541448e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('rate', sa.Column('search_dt', sa.TIMESTAMP(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('rate', 'search_dt')
    # ### end Alembic commands ###