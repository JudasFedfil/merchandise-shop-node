const { Order } = require('../models');
const PDFDocument = require('pdfkit');
const path = require('path');

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

exports.exportPdf = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=HoaDon_${order.id}.pdf`);
        doc.pipe(res); 

        const fontPath = path.join(__dirname, '../fonts/arial.ttf');
        
        doc.font(fontPath);

        doc.fontSize(20).text('HÓA ĐƠN MUA HÀNG', { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(12).text(`Mã đơn hàng: #${order.id}`);
        doc.text(`Khách hàng: ${order.customerName}`);
        doc.text(`Số điện thoại: ${order.phone}`);
        doc.text(`Địa chỉ: ${order.address}`);
        doc.text(`Ngày đặt: ${order.createdAt}`);
        doc.moveDown();

        doc.text('-'.repeat(50));
        doc.moveDown();
        doc.text('Danh sách sản phẩm:');
        doc.moveDown(0.5);
        
        let items = [];
        try { items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items; } catch(e){}
        
        items.forEach(item => {
            doc.text(`- ${item.name} (x${item.quantity}): ${item.price * item.quantity} VNĐ`);
        });

        doc.moveDown();
        doc.text('-'.repeat(50));
        doc.moveDown();
        doc.fontSize(14).text(`TỔNG CỘNG: ${order.total} VNĐ`, { align: 'right' });

        doc.end();
    } catch (error) {
        console.error('Lỗi xuất PDF:', error);
        res.status(500).json({ message: 'Lỗi tạo PDF' });
    }
};