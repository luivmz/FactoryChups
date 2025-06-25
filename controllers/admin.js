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

    const producto = new Producto(null, nombre, urlImagen, descripcion, precio);

    producto.save();

    res.redirect('/')
};

exports.getEditarProducto = (req, res) => {

    const modoEdicion = req.query.editar;
    const idProducto = req.params.idProducto;
    Producto.findById(idProducto, producto => {
        console.log(producto)
        if (!producto) {
            return res.redirect('/');
        }
        res.render('admin/editar-producto', { 
            titulo: 'Editar Producto', 
            path: '/admin/editar-producto',
            producto: producto,
            modoEdicion: true,
        })
    })
}


exports.postEditarProducto = (req, res, next) => {
    const idProducto = req.body.idProducto;
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const urlImagen = req.body.urlImagen;
    const descripcion = req.body.descripcion;
    const productoActualizado = new Producto(
      idProducto,
      nombre,
      urlImagen,
      descripcion,
      precio
    );
    productoActualizado.save();
    res.redirect('/admin/productos');
  };



exports.getProductos = (req, res) => {
    let productos = [];
    Producto.fetchAll(productosObtenidos => {
        productos = productosObtenidos;

        res.render('admin/productos', {
            prods: productos,
            titulo: "Administracion de Productos", 
            path: "/admin/productos"
        });
    })


};

exports.postEliminarProducto = (req, res, next) => {
    const idProducto = req.body.idProducto;
    Producto.deleteById(idProducto);
    res.redirect('/admin/productos');
  };