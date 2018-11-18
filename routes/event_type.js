var express = require("express");
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var eventType = require("../models/event_type");
// Rutas
app.get('/', mdAutenticacion.verificaToken, (req, res, next) => {

    eventType.find({}, 'name description status').
    exec(
        (err, eventTypes) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    message: 'Error al cargar tipo eventos',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                typeEvents: eventTypes
            });
        });

});

app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {

    var body = req.body;
    var eventtype = new eventType({
        name: body.name,
        status: body.status,
        description: body.description,
        is_tematic: body.is_tematic
    });

    eventtype.save((err, eventtypeGuardado) => {

        if (err) {
            res.status(400).json({
                ok: false,
                message: 'Error al crear event type',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            eventtype: eventtypeGuardado,
            usuariotoken: req.usuario
        });
    });

});

/*tipoEvento.save((err, tipoEventoGuardado) => {

    if (err) {
        res.status(400).json({
            ok: false,
            message: 'Error al crear tipo evento',
            errors: err
        });
    }

    res.status(200).json({
        ok: true,
        tipoEvent: tipoEventoGuardado,
        usuariotoken: req.usuario
    });
});*/

//});

/*

/*app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Evento.findById(id, (err, evento) => {

        if (err) {

            res.status(500).json({
                ok: false,
                message: 'Error al buscar eventos',
                errors: err
            });
        }

        if (!evento) {

            res.status(400).json({
                ok: false,
                message: 'El evento con el id ' + id + ' no existe',
                errors: { message: 'No existe el evento con el id' }
            });
        }

        evento.name = body.name;
        evento.status = body.status;
        evento.description = body.description;
        evento.is_enterprise = body.is_enterprise;

        evento.save((err, eventoGuardado) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuarios',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                message: 'Usuario actualizado',
                event: eventoGuardado
            });

        });

    });

});

app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {

    var id = req.params.id;

    Evento.findByIdAndRemove(id, (err, eventoBorrado) => {

        if (err) {
            res.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!eventoBorrado) {
            res.status(400).json({
                ok: false,
                message: 'No existe un evento con ese id',
                errors: { message: 'No existe un evento con ese id' }
            });
        }

        res.status(201).json({
            ok: true,
            event: eventBorrado
        });
    });

});*/

module.exports = app;