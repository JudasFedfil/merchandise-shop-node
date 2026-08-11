const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/hot', productController.getHotProducts); 
router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/', productController.createProduct);

module.exports = router;