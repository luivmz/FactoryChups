const Producto = require('../models/producto');

exports.getCrearProducto = (req, res) => {
    res.render('admin/editar-producto', {
        titulo: 'Crear Producto',
        path: '/admin/crear-producto',
        modoEdicion: false
    })
};

exports.postCrearProducto = (req, res) => {
    const nombre = req.body.nombre;
    const urlImagen = req.body.urlImagen;
    const precio = req.body.precio;
    const descripcion = req.body.descripcion;
    const producto = new Producto(nombre, precio, descripcion, urlImagen, null, req.usuario._id);
    producto.save()
        .then(result => {
            console.log(result);
            res.redirect('/admin/productos');
        })
        .catch(err => console.log(err));
};

exports.getEditarProducto = (req, res) => {
    const modoEdicion = req.query.editar;
    const idProducto = req.params.idProducto;
    Producto.findById(idProducto)
        .then(producto => {
            if (!producto) {
                return res.redirect('admin/productos');
            }
            res.render('admin/editar-producto', {
                titulo: 'Editar Producto',
                path: '/admin/editar-producto',
                producto: producto,
                modoEdicion: true,
            })
        })
        .catch(err => console.log(err));
} 


exports.postEditarProducto = (req, res, next) => {
    const idProducto = req.body.idProducto;
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const urlImagen = req.body.urlImagen;
    const descripcion = req.body.descripcion;
    const producto = new Producto(nombre, precio, descripcion, urlImagen, idProducto)
    producto.save()
        .then(result => {
            console.log('Producto actualizado satisfactoriamente');
            res.redirect('/admin/productos');
        })
        .catch(err => console.log(err));
}; 



exports.getProductos = (req, res) => {
    Producto.fetchAll()
        .then(productos => {
            res.render('admin/productos', {
                prods: productos,
                titulo: "Administracion de Productos",
                path: "/admin/productos"
            });
        })
        .catch(err => console.log(err));
};


exports.postEliminarProducto = (req, res, next) => {
    const idProducto = req.body.idProducto;
    Producto.deleteById(idProducto)
        .then(result => {
            console.log('Producto eliminado satisfactoriamente');
            res.redirect('/admin/productos');
        })
        .catch(err => console.log(err));
}; 