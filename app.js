const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const database = require('./utils/database');
const mongoConnect = database.mongoConnect;

const adminRoutes = require('./routes/admin')
const tiendaRoutes = require('./routes/tienda')
const errorController = require('./controllers/error');
const Usuario = require('./models/usuario');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // id de usuario creado en Mongo Atlas: 671c432403f36d5f18a242b4
    Usuario.findById('671c43736ffe44c3bbe8c44c')
        .then(usuario => {
            req.usuario = new Usuario(usuario.nombre, usuario.email, usuario.carrito, usuario._id);
            next();
        })
        .catch(err => console.log(err));

});

app.use('/admin', adminRoutes);
app.use(tiendaRoutes);


app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
})


