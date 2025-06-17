const path = require('path');

const express = require('express');
const bodyParser = require('body-parser')

const adminData = require('./routes/admin')
const tiendaRoutes = require('./routes/tienda')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(tiendaRoutes);

app.use((req, res, next) => {
    // res.status(404).send('<h1>PAGINA NO ENCONTRADA</h1>');
    console.log("Viendo que URL el usuario ingresa que no existe");
    console.log(req.url);
    next();
    //Solo rescibe el request pero no response
    //prmero realizar una funcion antes de responder
})
app.use((req, res, next) => {
    // responder despues de recibir el request
    // res.sendFile(path.join(appDir, 'views', 'tienda.html'));
    res.status(404).render('404', {
        titulo: 'Pagina No Encontrada', 
        path: '/404', 
        // hayProductos: productos.length > 0
    });
})

const puerto = 3000;
app.listen(puerto, () => {
    console.log("Se ha iniciado el servidor en: http://localhost:"+puerto+"");
});
