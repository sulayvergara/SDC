const model = require('./model')

async function insertar_usuario(dato) {
    const resultado = await new model(dato)
    return resultado.save()
}
async function obtener_usuario(dato) {
    try {
        if (!dato || Object.keys(dato).length === 0) {
            // Retorna todos los documentos si no hay filtro
            return await model.find();
        }
        // Retorna documentos que coinciden con el filtro
        return await model.find(dato);
    } catch (error) {
        throw new Error('Error al obtener los datos: ' + error.message);
    }
}

async function actualizarPuntaje(usuarioId, nuevoPuntaje) {
    try {
      const usuario = await model.findByIdAndUpdate(
        usuarioId,
        { puntaje: nuevoPuntaje },
        { new: true }
      );
      console.log('Puntaje actualizado:', usuario);
    } catch (error) {
      console.error('Error al actualizar el puntaje:', error);
    }
  }


module.exports = {
    insertar:insertar_usuario,
    obtener:obtener_usuario,
    actualizarPuntaje
}