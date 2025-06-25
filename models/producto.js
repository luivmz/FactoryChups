const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class Producto {
  constructor(nombre, precio, descripcion, urlImagen, id, idUsuario) {
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.urlImagen = urlImagen;
    this._id = id ? mongodb.ObjectId.createFromHexString(id) : null;
    this.idUsuario = idUsuario;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = dbOp = db.collection('productos').updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('productos').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('productos')
      .find()
      .toArray()
      .then(productos => {
        console.log(productos);
        return productos;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(idProducto) {
    console.log('Verificando el idProducto');
    console.log(idProducto);
    const db = getDb();
    return db
      .collection('productos')
      .find({ _id: mongodb.ObjectId.createFromHexString(idProducto) })
      .next()
      .then(producto => {
        console.log(producto);
        return producto;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static deleteById(idProducto) {
    const db = getDb();
    return db
      .collection('productos')
      .deleteOne({ _id: mongodb.ObjectId.createFromHexString(idProducto) })
      .then(result => {
        console.log('Eliminado');
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Producto;