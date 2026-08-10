const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const app = express();

app.use(cors({
    origin: 'http://localhost:8081', //điền cổng vue đang chạy
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.authenticate()
    .then(() => {
        console.log('Kết nối Database MySQL thành công!');
    })
    .catch(err => {
        console.error('Lỗi kết nối Database:', err);
    });

app.get('/', (req, res) => {
    res.send('Server Node.js cho Merch Shop đang hoạt động!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});