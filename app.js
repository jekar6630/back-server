// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Importar rutas
var appRoutes = require('./routes/app');
var appRoutesUser = require('./routes/usuario');
var appRoutesLogin = require('./routes/login');

// Inicializa variables
var app = express();

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexion a la bd
mongoose.connection.openUri('mongodb://localhost:27017/aeventDB', { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log('Bd server online');
});

// Rutas
app.use('/user', appRoutesUser);
app.use('/login', appRoutesLogin);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('express corriendo');
});