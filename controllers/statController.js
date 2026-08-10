const { Order } = require('../models');

exports.getRevenue = async (req, res) => {
    try {
        const { type, value, year } = req.query;
        const orders = await Order.findAll({ where: { status: 'completed' } });
        
        let cat1 = 0, cat2 = 0, cat3 = 0;

        orders.forEach(o => {
            const dateParts = o.createdAt.split('/'); // dd/MM/yyyy
            if (dateParts.length === 3) {
                const oMonth = parseInt(dateParts[1]);
                const oYear = parseInt(dateParts[2]);
                const oQuarter = Math.floor((oMonth - 1) / 3) + 1;

                let match = false;
                if (type === 'month' && oMonth == value && oYear == year) match = true;
                else if (type === 'quarter' && oQuarter == value && oYear == year) match = true;
                else if (type === 'year' && oYear == year) match = true;

                if (match && o.items) {
                    const items = JSON.parse(o.items);
                    items.forEach(item => {
                        const lineTotal = item.price * item.quantity;
                        if (item.categoryId == 1) cat1 += lineTotal;
                        else if (item.categoryId == 2) cat2 += lineTotal;
                        else if (item.categoryId == 3) cat3 += lineTotal;
                    });
                }
            }
        });

        res.status(200).json({ cat1, cat2, cat3 });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi thống kê' });
    }
};