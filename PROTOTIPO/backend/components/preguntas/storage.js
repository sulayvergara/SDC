const Question = require('./model');


// Función para obtener todas las preguntas de la base de datos
async function obtenerPreguntas() {
    try {
        return await Question.find({});
    } catch (error) {
        throw new Error('Error al obtener preguntas:', error);
    }
}

// Exportar las funciones necesarias
module.exports = {
    obtenerPreguntas
};
