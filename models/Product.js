const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    categoryId: { type: DataTypes.INTEGER, defaultValue: 1 },
    price: { type: DataTypes.DOUBLE, defaultValue: 0 },
    discount: { type: DataTypes.DOUBLE, defaultValue: 0 },
    discountStartDate: { type: DataTypes.DATE, field: 'discount_start_date' },
    discountEndDate: { type: DataTypes.DATE, field: 'discount_end_date' },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    sold: { type: DataTypes.INTEGER, defaultValue: 0 },
    image: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    isHot: { type: DataTypes.BOOLEAN, defaultValue: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 5 }
}, {
    tableName: 'products',
    timestamps: false
});

module.exports = Product;