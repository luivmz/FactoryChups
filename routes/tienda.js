const express = require('express');

const tiendaController = require('../controllers/tienda')

const router = express.Router();

router.get('/', tiendaController.getIndex);

router.get('/productos', tiendaController.getProductos);

router.get('/carrito', tiendaController.getCarrito);

router.get('/pedidos', tiendaController.getPedidos);


module.exports = router;