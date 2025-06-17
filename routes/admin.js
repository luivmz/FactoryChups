const path = require('path');
const express = require('express');

const appDir = require('../utils/path');


const router = express.Router();

const productos = [];

// /admin/crear-producto
router.get('/crear-producto', (req, res, next) => {
    res.render('crear-producto', { titulo: 'Crear Producto', path: '/admin/crear-producto' });
});

// /admin/productos
router.post('/crear-producto', (req, res, next) => {
    // console.log(req.body);
    productos.push({nombre: req.body.nombreproducto});
    res.redirect('/')
});

exports.routes = router;
exports.productos = productos;