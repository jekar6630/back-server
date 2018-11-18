var express = require("express");
var fileupload = require("express-fileupload");
var fs = require("fs");
var Evento = require("../models/evento");
var Usuario = require("../models/usuario");
var app = express();
app.use(fileupload());
// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    var tiposValidos = ['usuarios', 'eventos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colleccion no valido',
            errors: { message: 'Los tipos de coleccion valida son:' + tiposValidos.join(' ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    var archivo = req.files.imagen;
    var ext = archivo.name.split('.');
    var extensionArchivo = ext[ext.length - 1];

    var extensionesValidas = ['png', 'jpeg', 'gif', 'jpg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son:' + extensionesValidas.join(' ') }
        });
    }

    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
        /*res.status(200).json({
            ok: true,
            mensaje: 'arhivo movido con exito'
        });*/

    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            var pathviejo = '../uploads/usuarios/' + usuario.img;

            if (fs.existsSync(pathviejo)) {
                fs.unlink(pathviejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }
}

module.exports = app;