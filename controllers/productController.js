const { Product, ProductVariant } = require('../models');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: ProductVariant, as: 'variants' }],
            order: [['id', 'DESC']]
        });

        const formattedProducts = products.map(p => {
            const prod = p.toJSON();
            let activeDiscount = 0;
            const now = new Date();

            if (prod.discount > 0) {
                const start = prod.discountStartDate ? new Date(prod.discountStartDate) : null;
                const end = prod.discountEndDate ? new Date(prod.discountEndDate) : null;
                let isValid = true;
                if (start && now < start) isValid = false;
                if (end && now > end) isValid = false;
                if (isValid) activeDiscount = prod.discount;
            }

            prod.activeDiscount = activeDiscount;
            prod.discountedPrice = activeDiscount > 0 
                ? prod.price - (prod.price * (activeDiscount / 100)) 
                : prod.price;
            return prod;
        });
        res.status(200).json(formattedProducts);
    } catch (error) { res.status(500).json({ message: 'Lỗi server' }); }
};

//hàm lấy chi tiết sản phẩm
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { id: req.params.id },
            include: [{ model: ProductVariant, as: 'variants' }]
        });

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Tính toán lại giá Flash Sale cho sản phẩm chi tiết này
        const prod = product.toJSON();
        let activeDiscount = 0;
        const now = new Date();

        if (prod.discount > 0) {
            const start = prod.discountStartDate ? new Date(prod.discountStartDate) : null;
            const end = prod.discountEndDate ? new Date(prod.discountEndDate) : null;
            let isValid = true;
            if (start && now < start) isValid = false;
            if (end && now > end) isValid = false;
            if (isValid) activeDiscount = prod.discount;
        }

        prod.activeDiscount = activeDiscount;
        prod.discountedPrice = activeDiscount > 0 
            ? prod.price - (prod.price * (activeDiscount / 100)) 
            : prod.price;

        res.status(200).json(prod);
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        // Tạo sản phẩm và biến thể cùng lúc
        const newProduct = await Product.create(req.body, {
            include: [{ model: ProductVariant, as: 'variants' }]
        });
        res.status(201).json(newProduct);
    } catch (error) { res.status(500).json({ message: 'Lỗi thêm sản phẩm' }); }
};

exports.updateProduct = async (req, res) => {
    try {
        await Product.update(req.body, { where: { id: req.params.id } });
        // Xóa biến thể cũ và tạo lại
        if (req.body.variants) {
            await ProductVariant.destroy({ where: { productId: req.params.id } });
            const variants = req.body.variants.map(v => ({ ...v, productId: req.params.id }));
            await ProductVariant.bulkCreate(variants);
        }
        res.status(200).json({ message: 'Cập nhật thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi cập nhật' }); }
};

exports.deleteProduct = async (req, res) => {
    try {
        await ProductVariant.destroy({ where: { productId: req.params.id } });
        await Product.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Xóa thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi xóa sản phẩm' }); }
};

exports.getHotProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { isHot: true }, // Chỉ lấy sản phẩm có isHot = true
            include: [{ model: ProductVariant, as: 'variants' }],
            order: [['id', 'DESC']]
        });

        const formattedProducts = products.map(p => {
            const prod = p.toJSON();
            let activeDiscount = 0;
            const now = new Date();

            if (prod.discount > 0) {
                const start = prod.discountStartDate ? new Date(prod.discountStartDate) : null;
                const end = prod.discountEndDate ? new Date(prod.discountEndDate) : null;
                let isValid = true;
                if (start && now < start) isValid = false;
                if (end && now > end) isValid = false;
                if (isValid) activeDiscount = prod.discount;
            }

            prod.activeDiscount = activeDiscount;
            prod.discountedPrice = activeDiscount > 0 
                ? prod.price - (prod.price * (activeDiscount / 100)) 
                : prod.price;
            return prod;
        });

        res.status(200).json(formattedProducts);
    } catch (error) { 
        console.error("Lỗi khi lấy sản phẩm HOT:", error);
        res.status(500).json({ message: 'Lỗi server' }); 
    }
};