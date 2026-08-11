const { Order } = require('../models');
const PDFDocument = require('pdfkit');

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

        // Khởi tạo trang PDF
        const doc = new PDFDocument({ margin: 50 });
        
        // Cấu hình header để báo cho Vue.js biết đây là file PDF tải về
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=HoaDon_${order.id}.pdf`);
        doc.pipe(res); 

        // Vẽ nội dung (Dùng tiếng Việt không dấu để tránh lỗi font mặc định của PDFKit)
        doc.fontSize(20).text('HOA DON MUA HANG', { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(12).text(`Ma don hang: #${order.id}`);
        doc.text(`Khach hang: ${order.customerName}`);
        doc.text(`So dien thoai: ${order.phone}`);
        doc.text(`Dia chi: ${order.address}`);
        doc.text(`Ngay dat: ${order.createdAt}`);
        doc.moveDown();

        doc.text('-'.repeat(50));
        doc.moveDown();
        doc.text('Danh sach san pham:');
        doc.moveDown(0.5);
        
        let items = [];
        try { items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items; } catch(e){}
        
        items.forEach(item => {
            doc.text(`- ${item.name} (x${item.quantity}): ${item.price * item.quantity} VND`);
        });

        doc.moveDown();
        doc.text('-'.repeat(50));
        doc.moveDown();
        doc.fontSize(14).text(`TONG CONG: ${order.total} VND`, { align: 'right' });

        doc.end();
    } catch (error) {
        console.error('Lỗi xuất PDF:', error);
        res.status(500).json({ message: 'Lỗi tạo PDF' });
    }
};