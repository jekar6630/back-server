var seed = require("../config/config").SEED;
var jwt = require("jsonwebtoken");

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, seed, (err, decoded) => {

        if (err) {

            res.status(401).json({
                ok: false,
                message: 'No estas autorizado para ejecutar esta accion',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
}