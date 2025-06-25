const Producto = require('../models/producto');

exports.getProductos = (req, res) => {
    Producto.fetchAll()
        .then(productos => {
            res.render('tienda/lista-productos', {
                prods: productos,
                titulo: "Productos de la tienda",
                path: "/productos"
            });

        })
        .catch(err => console.log(err));
};

exports.getProducto = (req, res) => {
    const idProducto = req.params.idProducto;
    Producto.findById(idProducto)
        .then(producto => {
            if (!producto) {
                res.redirect('/');
            }
            res.render('tienda/detalle-producto', {
                producto: producto,
                titulo: producto.nombre,
                path: '/productos'
            });
        })
        .catch(err => console.log(err));
}

exports.getIndex = (req, res) => {
    Producto.fetchAll()
        .then(productos => {
            res.render('tienda/index', {
                prods: productos,
                titulo: "Pagina principal de la Tienda",
                path: "/"
            });

        })
        .catch(err => console.log(err));
}

exports.getCarrito = (req, res, next) => {
    req.usuario
        .getCarrito()
        .then(productos => {
            res.render('tienda/carrito', {
                path: '/carrito',
                titulo: 'Mi Carrito',
                productos: productos
            });
        })
        .catch(err => console.log(err));
};

exports.postCarrito = (req, res) => {
    const idProducto = req.body.idProducto;

    Producto.findById(idProducto)
        .then(producto => {
            return req.usuario.agregarAlCarrito(producto);
        })
        .then(result => {
            console.log(result);
            res.redirect('/carrito');
        })
        .catch(err => console.log(err));
}

exports.postEliminarProductoCarrito = (req, res, next) => {
    const idProducto = req.body.idProducto;
    req.usuario.deleteItemDelCarrito(idProducto)
        .then(result => {
            res.redirect('/carrito');
        })
        .catch(err => console.log(err));

};

exports.getPedidos = (req, res, next) => {
    req.usuario
        .getPedidos()
        .then(pedidos => {
            res.render('tienda/pedidos', {
                path: '/pedidos',
                titulo: 'Mis Pedidos',
                pedidos: pedidos
            });
        })
        .catch(err => console.log(err));
};


exports.postPedido = (req, res, next) => {
    req.usuario
      .agregarPedido()
      .then(result => {
        res.redirect('/pedidos');
      })
      .catch(err => console.log(err));
};