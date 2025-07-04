const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer'); // Leer archivos

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

// Define donde se almacenan los archivos por multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'imagenes');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});
// Define que tipo de archivos son permitidos
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('imagen'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

app.use(session({ secret: 'algo muy secreto', resave: false, saveUninitialized: false, store: store }));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if(!req.session.usuario){
    return next();
  }
  Usuario.findById(req.session.usuario._id)
    .then(usuario => {
      if (!usuario) {
        return next();
      }
      req.usuario = usuario;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });

});

app.use((req, res, next) => {
  res.locals.autenticado = req.session.autenticado;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(tiendaRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  // res.status(error.httpStatusCode).render(...);
  res.redirect('/500');
});

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    // console.log(result);
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


