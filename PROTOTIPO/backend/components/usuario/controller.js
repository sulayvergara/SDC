const storage = require('./storage')

function insertar_usuario( dato ) {
    return new Promise( (resolve, reject) => {
        if ( !dato.nombre || !dato.apellido || !dato.curso || !dato.paralelo ) {
            reject( 'Los datos se encuentran incompletos.' )
        } 
        
        if (dato.puntaje === undefined) {
            dato.puntaje = 0;
        }
        
        else {
            resolve( storage.insertar( dato ) )
        }
    } )
}

async function obtener_usuario(filtro = {}) {
    return new Promise((resolve, reject) => {
        storage.obtener(filtro)
            .then((resultados) => {
                if (resultados.length > 0) {
                    // Si no hay filtro específico, devuelve el último registro
                    if (Object.keys(filtro).length === 0) {
                        const ultimoRegistro = resultados.sort((a, b) => 
                            b.fecha_creacion - a.fecha_creacion)[0];
                        resolve({
                            nombre: ultimoRegistro.nombre,
                            apellido: ultimoRegistro.apellido,
                            paralelo: ultimoRegistro.paralelo,
                            puntaje: ultimoRegistro.puntaje
                        });
                    } else {
                        // Si hay filtro, devuelve todos los resultados encontrados
                        resolve(resultados.map(r => ({
                            nombre: r.nombre,
                            apellido: r.apellido,
                            paralelo: r.paralelo,
                            puntaje: r.puntaje
                        })));
                    }
                } else {
                    reject('No se encontraron registros');
                }
            })
            .catch((error) => reject(error));
    });
}

async function actualizar_puntaje(filtro, nuevoPuntaje) {
    return new Promise(async (resolve, reject) => {
        try {
            const usuarios = await storage.obtener(filtro);
            
            if (!usuarios || usuarios.length === 0) {
                reject('Usuario no encontrado');
                return;
            }

            const usuario = usuarios[0];
            
            if (typeof nuevoPuntaje !== 'number' || isNaN(nuevoPuntaje)) {
                reject('El puntaje debe ser un número válido');
                return;
            }

            const usuarioActualizado = await storage.actualizarPuntaje(usuario._id, nuevoPuntaje);
            resolve(usuarioActualizado);
        } catch (error) {
            reject(`Error al actualizar el puntaje: ${error.message}`);
        }
    });
}

async function incrementar_puntaje(filtro, incremento) {
    try {
        const usuarios = await storage.obtener(filtro);
        if (!usuarios || usuarios.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const usuario = usuarios[0];
        const nuevoPuntaje = usuario.puntaje + incremento;
        return await storage.actualizarPuntaje(usuario._id, nuevoPuntaje);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    insertar_usuario,
    obtener_usuario,
    actualizar_puntaje,
    incrementar_puntaje
}