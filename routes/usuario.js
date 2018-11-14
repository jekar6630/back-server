var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var Usuario = require("../models/usuario");
// Rutas
app.get('/', mdAutenticacion.verificaToken, (req, res, next) => {

    Usuario.find({}, 'fullname status type email verifyed').
    exec(
        (err, usuarios) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    message: 'Error al cargar usuarios',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                users: usuarios
            });
        });

});

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {

            res.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (!usuario) {

            res.status(400).json({
                ok: false,
                message: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe el usuario con el id' }
            });
        }

        usuario.fullname = body.fullname;
        usuario.email = body.email;
        usuario.status = body.status;
        usuario.type = body.type;
        usuario.verifyed = body.verifyed;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuarios',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                message: 'Usuario actualizado',
                usuario: usuarioGuardado
            });

        });

    });

});

app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {

    var body = req.body;
    var usuario = new Usuario({
        fullname: body.fullname,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        status: body.status,
        type: body.type,
        verifyed: body.verifyed
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            res.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });

});

app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            res.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            res.status(400).json({
                ok: false,
                message: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

module.exports = app;