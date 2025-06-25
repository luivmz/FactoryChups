const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRouter = require('./routes/admin');
const tiendaRoutes = require('./routes/tienda');
const errorControllers = require('./controllers/error');


const Persona = require('./models/persona')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use(tiendaRoutes);

app.use((req, res, next) => {
    console.log("Viendo que URL el usuario ingresa que no existe");
    console.log(req.url);
    next();
})

app.use(errorControllers.get404);

const puerto = 3000;
app.listen(puerto, () => {
    console.log("Aplicación ejemplo, http://localhost:"+puerto+"");
    console.log('Mi aplicacion permite el uso de los siguientes tipos de doc: ', Persona.tiposDeDocumento())
});
