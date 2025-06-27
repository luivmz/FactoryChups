const Producto = require('../models/producto');
const Pedido = require('../models/pedido');

exports.getProductos = (req, res, next) => {
    Producto.find()
        .then(productos => {
            res.render('tienda/lista-productos', {
                prods: productos,
                titulo: "Productos de la tienda",
                path: "/productos",
                autenticado: req.session.autenticado
            });

        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProducto = (req, res, next) => {
    const idProducto = req.params.idProducto;
    Producto.findById(idProducto)
        .then(producto => {
            if (!producto) {
                res.redirect('/');
            }
            res.render('tienda/detalle-producto', {
                producto: producto,
                titulo: producto.nombre,
                path: '/productos',
                autenticado: req.session.autenticado
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getIndex = (req, res, next) => {
    Producto.find()
        .then(productos => {
            res.render('tienda/index', {
                prods: productos,
                titulo: "Pagina principal de la Tienda",
                path: "/",
                autenticado: req.session.autenticado
            });

        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getCarrito = (req, res, next) => {
    req.usuario
        .populate('carrito.items.idProducto')
        .then(usuario => {
            console.log(usuario.carrito.items)
            const productos = usuario.carrito.items;
            res.render('tienda/carrito', {
                path: '/carrito',
                titulo: 'Mi Carrito',
                productos: productos,
                autenticado: req.session.autenticado
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCarrito = (req, res, next) => {
    const idProducto = req.body.idProducto;

    Producto.findById(idProducto)
        .then(producto => {
            return req.usuario.agregarAlCarrito(producto);
        })
        .then(result => {
            console.log(result);
            res.redirect('/carrito');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postEliminarProductoCarrito = (req, res, next) => {
    const idProducto = req.body.idProducto;
    req.usuario.deleteItemDelCarrito(idProducto)
        .then(result => {
            res.redirect('/carrito');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.getPedidos = (req, res, next) => {
    req.usuario
        Pedido.find({ 'usuario.idUsuario': req.usuario._id })
        .then(pedidos => {
            res.render('tienda/pedidos', {
                path: '/pedidos',
                titulo: 'Mis Pedidos',
                pedidos: pedidos,
                autenticado: req.session.autenticado
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.postPedido = (req, res, next) => {
    req.usuario
        .populate('carrito.items.idProducto')
        .then(usuario => {
        const productos = usuario.carrito.items.map(i => {
            return { cantidad: i.cantidad, producto: { ...i.idProducto._doc } };
        });
        const pedido = new Pedido({
            usuario: {
            nombre: req.usuario.email, // aca no hay valor para nombre asi que se pone email por el mmomento
            idUsuario: req.usuario
            },
            productos: productos
        });
        return pedido.save();
        })
        .then(result => {
            return req.usuario.limpiarCarrito();
        })
        .then(() => {
            res.redirect('/pedidos');
        })
        .catch(err => {
            const error = new Error(err);
            console.log(error);
            error.httpStatusCode = 500;
            return next(error);
        });
};