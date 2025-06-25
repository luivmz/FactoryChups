const Producto = require('../models/producto');

exports.getProductos = (req, res) => {
    let productos = [];
    Producto.fetchAll(productosObtenidos => {
        console.log(productosObtenidos);
        productos = productosObtenidos;

        res.render('tienda/lista-productos', {
            prods: productos,
            titulo: "Productos de la tienda", 
            path: "/productos"
        });
    })
};

exports.getIndex = (req, res) => {
    Producto.fetchAll(productos => {

        res.render('tienda/index', {
            prods: productos,
            titulo: "Pagina principal de la Tienda",    
            path: "/"
        });
    })
}

exports.getCarrito = (req, res, next) => {
    res.render('tienda/carrito', {
      path: '/carrito',
      titulo: 'Mi Carrito'
    });
  };

exports.getPedidos = (req, res, next) => {
res.render('tienda/pedidos', {
    path: '/pedidos',
    titulo: 'Mis Pedidos'
});
};