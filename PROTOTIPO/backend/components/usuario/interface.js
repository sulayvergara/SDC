const express = require('express')

const controller = require('./controller')
const response = require('../../network/response')

const routes = express.Router()

routes.post('/', function(req, res) {
    controller.insertar_usuario( req.body )
        .then( (data) => response.success(req, res, data, 201) )
        .catch( (error) => response.error(req, res, error, 400) )
})
routes.get('/', function(req, res) {
    controller.obtener_usuario()
        .then((data) => response.success(req, res, data, 200))
        .catch((error) => response.error(req, res, error, 400));
});
routes.put('/puntaje', function(req, res) {
    controller.actualizar_puntaje(req.query, req.body.puntaje)
        .then((data) => response.success(req, res, data, 200))
        .catch((error) => response.error(req, res, error, 400));
});

routes.post('/puntaje/incrementar', function(req, res) {
    controller.incrementar_puntaje(req.query, req.body.incremento)
        .then((data) => response.success(req, res, data, 200))
        .catch((error) => response.error(req, res, error, 400));
});

module.exports = routes