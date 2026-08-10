const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const path = require('path');  

const app = express();

//Middlewares
app.use(cors({
    origin: 'http://localhost:8081', //điền cổng vue đang chạy
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cho phép bên ngoài truy cập vào thư mục uploads 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


sequelize.authenticate()
    .then(() => {
        console.log('Kết nối Database MySQL thành công!');
    })
    .catch(err => {
        console.error('Lỗi kết nối Database:', err);
    });



//Các routes:
app.get('/', (req, res) => {
    res.send('Server Node.js cho Merch Shop đang hoạt động!');
});


//routes upload
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/upload', uploadRoutes);

// routes API Sản phẩm
const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

// routes API Tài khoản
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// routes API Đơn hàng
const orderRoutes = require('./routes/orderRoutes');
app.use('/orders', orderRoutes);

// routes API Thống kê
const statRoutes = require('./routes/statRoutes');
app.use('/statistics', statRoutes);

// khởi chạy
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});