const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/crear-producto
router.get('/crear-producto', adminController.getCrearProducto);

// /admin/productos
router.post('/crear-producto', adminController.postCrearProducto);

router.get('/productos', adminController.getProductos);

module.exports = router;