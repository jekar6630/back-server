// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializa variables
var app = express();

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'peticion correcta'
    });
});

// Conexion a la bd
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log('Bd server online');
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('express corriendo');
});