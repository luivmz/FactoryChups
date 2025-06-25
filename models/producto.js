const fs = require('fs');
const path = require('path');

const raizDir = require('../utils/path');
const p = path.join(raizDir, 'data', 'productos.json');

const getProductosFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            console.error('No se pudo leer el archivo de productos.');
            cb([]);
        }else{
            cb(JSON.parse(fileContent)); //convierte los datos del archivo a leible
        }
    });
}

module.exports = class Producto {
    constructor(nombre, urlImagen, descripcion, precio) {
        this.nombre = nombre;
        this.urlImagen = urlImagen;
        this.descripcion = descripcion;
        this.precio = precio;
    }
    save(){
        getProductosFromFile(productos =>{
            console.log(`Producto ${this.nombre} agregado.`);
            productos.push(this);
            fs.writeFile(p, JSON.stringify(productos), (err) => { //convierte a JSON para guardar
                if (err) {
                    console.error('No se pudo guardar el producto.');
                }
            });
        });
    }
    static fetchAll(cb){
        return getProductosFromFile(cb);
    }
}