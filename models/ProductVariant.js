const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductVariant = sequelize.define('ProductVariant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    extraPrice: { type: DataTypes.DOUBLE, defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'product_variants',
    timestamps: false
});

module.exports = ProductVariant;