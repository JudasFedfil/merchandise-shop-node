const { Order } = require('../models');
const PDFDocument = require('pdfkit');
const path = require('path');

exports.getRevenue = async (req, res) => {
    try {
        const { type, value, year } = req.query;
        
        // Chỉ lấy các hóa đơn đã Hoàn thành
        const orders = await Order.findAll({ where: { status: 'completed' } });
        
        let cat1 = 0, cat2 = 0, cat3 = 0;

        // Ép kiểu dữ liệu từ URL truyền vào thành số nguyên (Number)
        const reqValue = parseInt(value, 10);
        const reqYear = parseInt(year, 10);

        orders.forEach(o => {
            if (!o.createdAt) return;

            // Xử lý chuỗi ngày: tách lấy phần "dd/MM/yyyy", loại bỏ giờ phút (nếu có khoảng trắng)
            const dateOnly = o.createdAt.split(' ')[0]; 
            const dateParts = dateOnly.split('/');
            
            if (dateParts.length === 3) {
                const oMonth = parseInt(dateParts[1], 10);
                const oYear = parseInt(dateParts[2], 10);
                const oQuarter = Math.floor((oMonth - 1) / 3) + 1;

                let match = false;
                
                // So sánh số nguyên thay vì chuỗi
                if (type === 'month' && oMonth === reqValue && oYear === reqYear) match = true;
                else if (type === 'quarter' && oQuarter === reqValue && oYear === reqYear) match = true;
                else if (type === 'year' && oYear === reqYear) match = true;

                if (match && o.items) {
                    try {
                        const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                        
                        items.forEach(item => {
                            const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);
                            
                            // Nếu trong giỏ hàng thiếu categoryId, ép mặc định vào cột 1 (Figure)
                            const catId = item.categoryId ? Number(item.categoryId) : 1; 
                            
                            if (catId === 1) cat1 += lineTotal;
                            else if (catId === 2) cat2 += lineTotal;
                            else if (catId === 3) cat3 += lineTotal;
                        });
                    } catch (e) {
                        console.error("Lỗi đọc JSON dữ liệu giỏ hàng của đơn:", o.id);
                    }
                }
            }
        });

        res.status(200).json({ cat1, cat2, cat3 });
    } catch (error) {
        console.error("Lỗi API thống kê:", error);
        res.status(500).json({ message: 'Lỗi khi tính toán thống kê' });
    }
};

exports.exportPdf = async (req, res) => {
    try {
        const { type, value, year } = req.query;
        const orders = await Order.findAll({ where: { status: 'completed' } });
        
        let cat1 = 0, cat2 = 0, cat3 = 0;
        const reqValue = parseInt(value, 10);
        const reqYear = parseInt(year, 10);

        orders.forEach(o => {
            if (!o.createdAt) return;
            const dateParts = o.createdAt.split(' ')[0].split('/');
            if (dateParts.length === 3) {
                const oMonth = parseInt(dateParts[1], 10);
                const oYear = parseInt(dateParts[2], 10);
                const oQuarter = Math.floor((oMonth - 1) / 3) + 1;

                let match = false;
                if (type === 'month' && oMonth === reqValue && oYear === reqYear) match = true;
                else if (type === 'quarter' && oQuarter === reqValue && oYear === reqYear) match = true;
                else if (type === 'year' && oYear === reqYear) match = true;

                if (match && o.items) {
                    try {
                        const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                        items.forEach(item => {
                            const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);
                            const catId = item.categoryId ? Number(item.categoryId) : 1; 
                            if (catId === 1) cat1 += lineTotal;
                            else if (catId === 2) cat2 += lineTotal;
                            else if (catId === 3) cat3 += lineTotal;
                        });
                    } catch (e) {}
                }
            }
        });

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=BaoCaoDoanhThu.pdf`);
        doc.pipe(res);

        const fontPath = path.join(__dirname, '../fonts/arial.ttf');
        doc.font(fontPath);

        // ĐỊNH DẠNG TIỀN TỆ
        const formatMoney = (amount) => new Intl.NumberFormat('vi-VN').format(amount);

        doc.fontSize(20).text('BÁO CÁO DOANH THU', { align: 'center' });
        doc.moveDown();
        
        let timeText = '';
        if (type === 'month') timeText = `Tháng ${value}`;
        else if (type === 'quarter') timeText = `Quý ${value}`;
        else timeText = `Năm`;

        doc.fontSize(12).text(`Thời gian: ${timeText} năm ${year}`);
        doc.moveDown();
        doc.text('-'.repeat(50));
        doc.moveDown();

        doc.fontSize(14).text(`1. Figure Anime: ${formatMoney(cat1)} VNĐ`);
        doc.text(`2. Gundam (Gunpla): ${formatMoney(cat2)} VNĐ`);
        doc.text(`3. Merchandise: ${formatMoney(cat3)} VNĐ`);
        
        doc.moveDown();
        doc.text('-'.repeat(50));
        doc.moveDown();
        doc.fontSize(16).text(`TỔNG DOANH THU: ${formatMoney(cat1 + cat2 + cat3)} VNĐ`, { align: 'right' });

        doc.end();
    } catch (error) {
        console.error("Lỗi tạo PDF thống kê:", error);
        res.status(500).json({ message: 'Lỗi tạo PDF' });
    }
};