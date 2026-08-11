const { Order, Product } = require('../models');
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
        
        let items = [];
        try { 
            items = typeof req.body.items === 'string' ? JSON.parse(req.body.items) : req.body.items; 
        } catch(e) {}
        
        for (const item of items) {
            // Vue.js có thể gửi ID sản phẩm qua biến item.id hoặc item.productId
            const productId = item.productId || item.id; 
            if (productId) {
                const product = await Product.findByPk(productId);
                if (product) {
                    // Trừ tồn kho (đảm bảo không bị âm) và cộng số lượng đã bán
                    product.stock = Math.max(0, product.stock - item.quantity);
                    product.sold = product.sold + item.quantity;
                    await product.save();
                }
            }
        }
        
        res.status(201).json(order);
    } catch (error) { 
        console.error("Lỗi tạo hóa đơn:", error);
        res.status(500).json({ message: 'Lỗi tạo hóa đơn' }); 
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        const oldStatus = order.status;
        const newStatus = req.body.status;

        order.status = newStatus;
        await order.save();

        if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
            let items = [];
            try { 
                items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items; 
            } catch(e) {}
            
            for (const item of items) {
                const productId = item.productId || item.id;
                if (productId) {
                    const product = await Product.findByPk(productId);
                    if (product) {
                        product.stock = product.stock + item.quantity;
                        product.sold = Math.max(0, product.sold - item.quantity); 
                        await product.save();
                    }
                }
            }
        }

        res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
    } catch (error) { 
        console.error("Lỗi cập nhật trạng thái:", error);
        res.status(500).json({ message: 'Lỗi cập nhật trạng thái' }); 
    }
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