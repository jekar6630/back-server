var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var seed = require("../config/config").SEED;
var app = express();
var Usuario = require("../models/usuario");

app.post('/', (req, res, next) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBd) => {

        if (err) {
            res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioBd) {
            res.status(500).json({
                ok: false,
                message: 'Email incorrecto - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBd.password)) {
            res.status(500).json({
                ok: false,
                message: 'Password incorrecto - password',
                errors: err
            });
        }

        //Crear un token
        usuarioBd.password = ':)';
        var token = jwt.sign({ usuario: usuarioBd }, seed, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            mensaje: usuarioBd,
            id: usuarioBd._id,
            token: token
        });

    });
});

module.exports = app;