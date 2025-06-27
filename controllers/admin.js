const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Producto = require('../models/producto');

exports.getCrearProducto = (req, res, next) => {
    res.render('admin/editar-producto', { 
      titulo: 'Crear Producto',
      path: '/admin/crear-producto',
      modoEdicion: false,
      tieneError: false,
      mensajeError: null,
      erroresValidacion: []
    });
};

exports.postCrearProducto = (req, res, next) => {
    const nombre = req.body.nombre;
    const urlImagen = req.body.urlImagen;
    const precio = req.body.precio;
    const descripcion = req.body.descripcion;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render('admin/editar-producto', {
        titulo: 'Crear Product',
        path: '/admin/editar-product',
        modoEdicion: false,
        tieneError: true,
        mensajeError: errors.array()[0].msg,
        erroresValidacion: errors.array(),
        producto: {
          nombre: nombre,
          urlImagen: urlImagen,
          precio: precio,
          descripcion: descripcion
        }
      });
    }

    const producto = new Producto({
        _id: new mongoose.Types.ObjectId('67202c4ea32f034a44727cfa'),
        nombre: nombre,
        precio: precio,
        descripcion: descripcion,
        urlImagen: urlImagen,
        idUsuario: req.usuario._id
    });
    // const producto = new Producto({
    //     nombre: nombre,
    //     precio: precio,
    //     descripcion: descripcion,
    //     urlImagen: urlImagen,
    //     idUsuario: req.usuario._id
    // });
    producto.save()
        .then(result => {
            console.log(result);
            res.redirect('/admin/productos');
        })
        .catch(err => {
            // console.log(err);
            // res.redirect('/500');
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditarProducto = (req, res, next) => {
    const modoEdicion = req.query.editar;
    if (!modoEdicion) {
        console.log('No editar producto');
        return res.redirect('/');
    }
    const idProducto = req.params.idProducto;
    // throw new Error('Error de prueba'); // corta el flujo
    Producto.findById(idProducto)
        .then(producto => {
            if (!producto) {
                return res.redirect('admin/productos');
            }
            res.render('admin/editar-producto', {
                titulo: 'Editar Producto',
                path: '/admin/edit-producto',
                modoEdicion: modoEdicion,
                producto: producto,
                tieneError: false,
                mensajeError: null,
                erroresValidacion: [],
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
} 


exports.postEditarProducto = (req, res, next) => {
    const idProducto = req.body.idProducto;
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const urlImagen = req.body.urlImagen;
    const descripcion = req.body.descripcion;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/editar-producto', {
        titulo: 'Editar Producto',
        path: '/admin/editar-producto',
        modoEdicion: true,
        tieneError: true,
        mensajeError: errors.array()[0].msg,
        erroresValidacion: errors.array(),
        producto: {
            nombre: nombre,
            urlImagen: urlImagen,
            precio: precio,
            descripcion: descripcion,
            _id: idProducto
        }
        });
    }

    Producto.findById(idProducto)
        .then(producto => {
            if (producto.idUsuario.toString() !== req.usuario._id.toString()) { // el usuario que creo el producto puede editar
                return res.redirect('/');
            }
            producto.nombre = nombre;
            producto.precio = precio;
            producto.descripcion = descripcion;
            producto.urlImagen = urlImagen;
            return producto.save();
        })
        .then(result => {
            console.log('Producto actualizado satisfactoriamente');
            res.redirect('/admin/productos');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}; 



exports.getProductos = (req, res, next) => {
    Producto
        // .find()
        .find({ idUsuario: req.usuario._id })
        .then(productos => {
            res.render('admin/productos', {
                prods: productos,
                titulo: "Administracion de Productos",
                path: '/admin/productos',
                autenticado: req.session.autenticado
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.postEliminarProducto = (req, res, next) => {
    const idProducto = req.body.idProducto;
    Producto.deleteOne({ _id: idProducto, idUsuario: req.usuario._id }) // es una condición donde verifica si los id mandados son iguales
        .then(result => {
            console.log('Producto eliminado satisfactoriamente');
            res.redirect('/admin/productos');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}; 