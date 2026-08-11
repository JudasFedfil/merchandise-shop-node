const { Order } = require('../models');

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