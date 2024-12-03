"""Create Conversion Column

Revision ID: e654541448e6
Revises: a3de79aed100
Create Date: 2024-11-28 11:42:53.290574

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e654541448e6'
down_revision: Union[str, None] = 'a3de79aed100'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('payments', sa.Column('cashConversion', sa.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('payments', sa.Column('cardConversion', sa.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('payments', sa.Column('tradeInConversion', sa.DECIMAL(precision=10, scale=2), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('payments', 'tradeInConversion')
    op.drop_column('payments', 'cardConversion')
    op.drop_column('payments', 'cashConversion')
    # ### end Alembic commands ###
