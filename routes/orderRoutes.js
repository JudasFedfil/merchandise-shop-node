const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.patch('/:id', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);

// (Tạm thời chưa tích hợp file PDF, sẽ gọi fake API trước để Vue không lỗi)
router.get('/:id/export-pdf', orderController.exportPdf);

module.exports = router;