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

async function obtener_usuario() {
    return new Promise((resolve, reject) => {
        storage.obtener({}) // Llama a la función sin filtro
            .then((resultados) => {
                console.log('Resultados obtenidos:', resultados); // Agrega un log para depuración
                if (resultados.length > 0) {
                    // Ordena por fecha_creacion en orden descendente y toma el primer resultado
                    const ultimoRegistro = resultados.sort((a, b) => b.fecha_creacion - a.fecha_creacion)[0];
                    console.log('Último registro:', ultimoRegistro); // Agrega un log para depuración
                    // Devuelve solo el nombre y el apellido
                    const resultadoFiltrado = {
                        nombre: ultimoRegistro.nombre,
                        apellido: ultimoRegistro.apellido,
                        paralelo: ultimoRegistro.paralelo,
                        puntaje: ultimoRegistro.puntaje
                    };
                    console.log('final:', resultadoFiltrado);
                    resolve(resultadoFiltrado);
                } else {
                    reject('No se encontraron registros');
                }
            })
            .catch((error) => reject(error));
    });
}


module.exports = {
    insertar_usuario,
    obtener_usuario
}