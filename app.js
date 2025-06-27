const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const Usuario = require('./models/usuario');

const adminRoutes = require('./routes/admin')
const tiendaRoutes = require('./routes/tienda')
const authRoutes = require('./routes/auth');

const MONGODB_URI = 'mongodb+srv://luisvilameza:secreto@cluster0.rlmvrcz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'algo muy secreto', resave: false, saveUninitialized: false, store: store }));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  console.log(req.session);
  if(!req.session.usuario){
    return next();
  }
  Usuario.findById(req.session.usuario._id)
    .then(usuario => {
      console.log(usuario)
      req.usuario = usuario;
      next();
    })
    .catch(err => console.log(err));

});

app.use((req, res, next) => {
  res.locals.autenticado = req.session.autenticado;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(tiendaRoutes);
app.use(authRoutes);


app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    console.log(result);
    // Usuario.findOne().then(usuario => {
    //     if (!usuario) {
    //       const usuario = new Usuario({
    //         nombre: 'Luisvilameza',
    //         email: 'luisvilameza@gmail.com',
    //         carrito: {
    //           items: []
    //         }
    //       });
    //       usuario.save();
    //     }
    //   });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });


