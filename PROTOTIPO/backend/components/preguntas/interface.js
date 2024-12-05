// preguntas/interface.js
const express = require('express')

const controller = require('./controller')
const response = require('../../network/response')
const routes = express.Router()

// preguntas/interface.js
// preguntas/interface.js
routes.get('/', function(req, res) {
  controller.obtenerPreguntas()
      .then(data => res.status(200).json(data))  // Enviar los datos directamente como JSON
      .catch(error => res.status(400).json({ message: error }));  // Enviar el error como JSON
});


// Exportar las funciones para que puedan ser usadas en otros archivos
module.exports = routes
