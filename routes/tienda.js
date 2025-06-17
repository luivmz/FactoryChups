const path = require('path');
const express = require('express');

const appDir = require('../utils/path');

const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    const productos = adminData.productos
    console.log('Lista de Productos: ',productos);
    // res.sendFile(path.join(appDir, 'views', 'tienda.html'));
    res.render('tienda', {
        prods: productos, 
        titulo: 'La Tienda', 
        path: '/', 
        // hayProductos: productos.length > 0
    });
});

module.exports = router;