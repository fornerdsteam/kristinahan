"""Initial migration

Revision ID: f0c3f6307442
Revises: 
Create Date: 2024-10-31 02:41:29.349653

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f0c3f6307442'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('affiliation',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('attributes',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('value', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('value')
    )
    op.create_table('author',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('category',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('form',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('role', sa.Enum('User', 'Admin', name='userrole'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('event',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('form_id', sa.Integer(), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=True),
    sa.Column('end_date', sa.Date(), nullable=True),
    sa.Column('inProgress', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['form_id'], ['form.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('form_category',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('form_id', sa.Integer(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['category.id'], ),
    sa.ForeignKeyConstraint(['form_id'], ['form.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('form_repair',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('form_id', sa.Integer(), nullable=False),
    sa.Column('information', sa.String(length=255), nullable=True),
    sa.Column('unit', sa.Enum('CM', 'INCH', name='unittype'), nullable=True),
    sa.Column('isAlterable', sa.Boolean(), nullable=True),
    sa.Column('standards', sa.String(length=255), nullable=True),
    sa.Column('indexNumber', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['form_id'], ['form.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('product',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.Column('price', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['category.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('order',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('event_id', sa.Integer(), nullable=False),
    sa.Column('author_id', sa.Integer(), nullable=True),
    sa.Column('modifier_id', sa.Integer(), nullable=True),
    sa.Column('affiliation_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
    sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
    sa.Column('status', sa.Enum('Order_Completed', 'Packaging_Completed', 'Repair_Received', 'Repair_Completed', 'In_delivery', 'Delivery_completed', 'Receipt_completed', 'Accommodation', name='orderstatus'), nullable=True),
    sa.Column('groomName', sa.String(length=255), nullable=True),
    sa.Column('brideName', sa.String(length=255), nullable=True),
    sa.Column('contact', sa.String(length=255), nullable=True),
    sa.Column('address', sa.String(length=255), nullable=True),
    sa.Column('collectionMethod', sa.String(length=20), nullable=True),
    sa.Column('notes', sa.String(), nullable=True),
    sa.Column('alter_notes', sa.String(), nullable=True),
    sa.Column('totalPrice', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('advancePayment', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('balancePayment', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('isTemporary', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['affiliation_id'], ['affiliation.id'], ),
    sa.ForeignKeyConstraint(['author_id'], ['author.id'], ),
    sa.ForeignKeyConstraint(['event_id'], ['event.id'], ),
    sa.ForeignKeyConstraint(['modifier_id'], ['author.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('product_attributes',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.Column('attribute_id', sa.Integer(), nullable=False),
    sa.Column('indexNumber', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['attribute_id'], ['attributes.id'], ),
    sa.ForeignKeyConstraint(['product_id'], ['product.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('alterationDetails',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('order_id', sa.Integer(), nullable=False),
    sa.Column('form_repair_id', sa.Integer(), nullable=False),
    sa.Column('figure', sa.Float(), nullable=True),
    sa.Column('alterationFigure', sa.Float(), nullable=True),
    sa.ForeignKeyConstraint(['form_repair_id'], ['form_repair.id'], ),
    sa.ForeignKeyConstraint(['order_id'], ['order.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('orderItems',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('order_id', sa.Integer(), nullable=False),
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.Column('attribute_id', sa.Integer(), nullable=True),
    sa.Column('quantity', sa.Integer(), nullable=True),
    sa.Column('price', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.ForeignKeyConstraint(['attribute_id'], ['attributes.id'], ),
    sa.ForeignKeyConstraint(['order_id'], ['order.id'], ),
    sa.ForeignKeyConstraint(['product_id'], ['product.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('payments',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('order_id', sa.Integer(), nullable=False),
    sa.Column('payer', sa.String(length=255), nullable=True),
    sa.Column('payment_date', sa.TIMESTAMP(), nullable=True),
    sa.Column('cashAmount', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('cashCurrency', sa.Enum('KRW', 'JPY', 'USD', name='currencytype'), nullable=True),
    sa.Column('cardAmount', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('cardCurrency', sa.Enum('KRW', 'JPY', 'USD', name='currencytype'), nullable=True),
    sa.Column('tradeInAmount', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('tradeInCurrency', sa.Enum('K10', 'K14', 'K18', 'K24', name='tradeincurrencytype'), nullable=True),
    sa.Column('notes', sa.String(), nullable=True),
    sa.Column('paymentMethod', sa.Enum('ADVANCE', 'BALANCE', name='paymentmethodtype'), nullable=True),
    sa.ForeignKeyConstraint(['order_id'], ['order.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('payments')
    op.drop_table('orderItems')
    op.drop_table('alterationDetails')
    op.drop_table('product_attributes')
    op.drop_table('order')
    op.drop_table('product')
    op.drop_table('form_repair')
    op.drop_table('form_category')
    op.drop_table('event')
    op.drop_table('user')
    op.drop_table('form')
    op.drop_table('category')
    op.drop_table('author')
    op.drop_table('attributes')
    op.drop_table('affiliation')
    # ### end Alembic commands ###