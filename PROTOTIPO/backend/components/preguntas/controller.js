// controller.js
const storage = require('./storage');

function obtenerPreguntas() {
  return new Promise((resolve, reject) => {
    storage.obtenerPreguntas()
      .then(data => resolve(data))
      .catch(error => reject('No se pudieron obtener las preguntas.'));
  });
}

module.exports = {
  obtenerPreguntas,
};
