const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductVariant = sequelize.define('ProductVariant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_id' },
    name: { type: DataTypes.STRING, allowNull: false, field: 'label' },
    extraPrice: { type: DataTypes.DOUBLE, defaultValue: 0, field: 'extra_price' },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'product_variants',
    timestamps: false
});

module.exports = ProductVariant;