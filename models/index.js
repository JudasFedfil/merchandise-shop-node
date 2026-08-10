const sequelize = require('../config/database');
const Category = require('./Category');
const Product = require('./Product');
const ProductVariant = require('./ProductVariant');
const User = require('./User');
const Order = require('./Order');

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
    sequelize,
    Category,
    Product,
    ProductVariant,
    User,
    Order
};