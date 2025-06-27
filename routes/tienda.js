const express = require('express');

const tiendaController = require('../controllers/tienda')
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', tiendaController.getIndex);

router.get('/productos', tiendaController.getProductos);

router.get('/contacto', tiendaController.getContacto);

router.get('/acerca-de-nosotros', tiendaController.acercadenosotros);

router.get('/productos/:idProducto', tiendaController.getProducto);

router.get('/carrito', isAuth, tiendaController.getCarrito);

router.post('/carrito', isAuth, tiendaController.postCarrito);

router.post('/eliminar-producto-carrito', isAuth, tiendaController.postEliminarProductoCarrito);

router.get('/pedidos', isAuth, tiendaController.getPedidos);

router.post('/crear-pedido', isAuth, tiendaController.postPedido);

router.get('/pedidos/:idPedido', isAuth, tiendaController.getComprobante);

// router.get('/checkout', tiendaController.getCheckout);


module.exports = router;