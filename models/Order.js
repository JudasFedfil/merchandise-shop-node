const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customerName: { type: DataTypes.STRING, field: 'customer_name' },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.STRING, field: 'created_at' },
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    items: { type: DataTypes.TEXT },
    total: { type: DataTypes.DOUBLE },
    userId: { type: DataTypes.INTEGER, field: 'user_id' }
}, {
    tableName: 'orders',
    timestamps: false
});

module.exports = Order;