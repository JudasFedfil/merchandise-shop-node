const { Order } = require('../models');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ order: [['id', 'DESC']] });
        res.status(200).json(orders);
    } catch (error) { res.status(500).json({ message: 'Lỗi server' }); }
};

exports.createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).json(order);
    } catch (error) { res.status(500).json({ message: 'Lỗi tạo hóa đơn' }); }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        await Order.update({ status: req.body.status }, { where: { id: req.params.id } });
        res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi cập nhật trạng thái' }); }
};

exports.deleteOrder = async (req, res) => {
    try {
        await Order.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Xóa thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi xóa hóa đơn' }); }
};