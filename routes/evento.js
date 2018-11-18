var express = require("express");
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var Evento = require("../models/evento");
// Rutas
app.get('/', mdAutenticacion.verificaToken, (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Evento.find({}, 'name status description is_enterprise event_type')
        .populate('event_type', '_id name status is_tematic')
        .skip(desde)
        .limit(5)
        .exec(
            (err, eventos) => {

                if (err) {
                    res.status(500).json({
                        ok: false,
                        message: 'Error al cargar eventos',
                        errors: err
                    });
                }

                Evento.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        events: eventos,
                        total: conteo
                    });
                });
            });

});

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Evento.findById(id, (err, evento) => {

        if (err) {

            res.status(500).json({
                ok: false,
                message: 'Error al buscar evento',
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
        evento.event_type = body.event_type;

        evento.save((err, eventoGuardado) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar evento',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                message: 'Evento actualizado',
                event: eventoGuardado
            });

        });

    });

});

app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {

    var body = req.body;
    var evento = new Evento({
        name: body.name,
        status: body.status,
        description: body.description,
        is_enterprise: body.is_enterprise,
        event_type: body.event_type
    });

    evento.save((err, eventoGuardado) => {

        if (err) {
            res.status(400).json({
                ok: false,
                message: 'Error al crear evento',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            event: eventoGuardado,
            usuariotoken: req.usuario
        });
    });

});

app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {

    var id = req.params.id;

    Evento.findByIdAndRemove(id, (err, eventoBorrado) => {

        if (err) {
            res.status(500).json({
                ok: false,
                message: 'Error al borrar evento',
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
            event: eventoBorrado
        });
    });

});

module.exports = app;