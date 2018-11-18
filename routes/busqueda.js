var express = require("express");
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var Evento = require("../models/evento");
var Usuario = require("../models/usuario");
// Rutas

app.get('/coleccion/:tabla/:busqueda', mdAutenticacion.verificaToken, (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'eventos':
            promesa = buscarEventos(busqueda, regex);
            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: usuarios y eventos',
                error: { message: 'Tipo de busqueda incorrecto' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

app.get('/all/:busqueda', mdAutenticacion.verificaToken, (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarEventos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            eventos: respuestas[0],
            usuarios: respuestas[1]
        });
    });
});

function buscarEventos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Evento.find({ name: regex })
            .populate('event_type', '_id name status is_tematic')
            .exec((err, eventos) => {
                if (err) {
                    reject('Error al cargar eventos', err);
                } else {
                    resolve(eventos);
                }
            });

    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'fullname email status type verifyed')
            .or([{ 'fullname': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;