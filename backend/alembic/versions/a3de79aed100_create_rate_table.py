"""Create rate table

Revision ID: a3de79aed100
Revises: f0c3f6307442
Create Date: 2024-10-31 03:04:01.239287

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3de79aed100'
down_revision: Union[str, None] = 'f0c3f6307442'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('rate',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('gold_bas_dt', sa.Date(), nullable=True),
    sa.Column('gold_10k', sa.Float(), nullable=True),
    sa.Column('gold_14k', sa.Float(), nullable=True),
    sa.Column('gold_18k', sa.Float(), nullable=True),
    sa.Column('gold_24k', sa.Float(), nullable=True),
    sa.Column('exchange_bas_dt', sa.Date(), nullable=True),
    sa.Column('usd', sa.Float(), nullable=True),
    sa.Column('jpy', sa.Float(), nullable=True),
    sa.Column('krw', sa.Float(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('rate')
    # ### end Alembic commands ###
