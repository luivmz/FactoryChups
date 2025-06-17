const path = require('path');

const express = require('express');
const bodyParser = require('body-parser')

const adminRoutes = require('./routes/admin')
const tiendaRoutes = require('./routes/tienda')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRoutes);
app.use(tiendaRoutes);

app.use((req, res, next) => {
    // res.status(404).send('<h1>PAGINA NO ENCONTRADA</h1>');
    console.log('Viendo que URL el usuario inhresa pero no existe')
    console.log(req.url);
    next();
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

const puerto = 3000;
app.listen(puerto, () => {
    console.log("Se ha iniciado el servidor en: http://localhost:"+puerto+"");
});
