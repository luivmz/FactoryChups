const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');

exports.getIngresar = (req, res, next) => {
    let mensaje = req.flash('error');
    if (mensaje.length > 0) {
      mensaje = mensaje[0];
    } else {
      mensaje = null;
    }
    res.render('auth/ingresar', {
      path: '/ingresar',
      titulo: 'Ingresar',
      autenticado: false,
      mensajeError: mensaje
    });
};

exports.postIngresar = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  Usuario.findOne({ email: email })
    .then(usuario => {
      if (!usuario) {
        req.flash('error', 'Invalido email o password');
        return res.redirect('/ingresar');
      }
      bcrypt
        .compare(password, usuario.password)
        .then(hayCoincidencia => {
          if (hayCoincidencia) {
            req.session.autenticado = true;
            req.session.usuario = usuario;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalido email o password');
          res.redirect('/ingresar');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/ingresar');
        });
    })  
    .catch(err => console.log(err));
};

exports.getRegistrarse = (req, res, next) => {
  let mensaje = req.flash('error');
  if (mensaje.length > 0) {
    mensaje = mensaje[0];
  } else {
    mensaje = null;
  }
  res.render('auth/registrarse', {
    path: '/registrarse',
    titulo: 'Registrarse',
    autenticado: false,
    mensajeError: mensaje
  });
};

exports.postRegistrarse = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirmado = req.body.passwordConfirmado;

  if (password !== passwordConfirmado) {
    req.flash('error', 'Debe usar el mismo password')
    res.redirect('/registrarse');
  }
  if (evaluarComplejidadPassword(password)) {
    req.flash('error', 'El password debe tener longitud minima de 8 caracteres, letras y numeros....')
    res.redirect('/registrarse');
  }

  Usuario.findOne({ email: email })
    .then(usuarioDoc => {
      if (usuarioDoc) {
        req.flash('error', 'El email ingresado ya existe');
        return res.redirect('/registrarse');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const usuario = new Usuario({
            email: email,
            password: hashedPassword,
            carrito: { items: [] }
          });
          return usuario.save();
        })
        .then(result => {
          res.redirect('/ingresar');
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postSalir = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
    });
};

evaluarComplejidadPassword = (password) => {
  return password.length > 7;
}