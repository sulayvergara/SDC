const usuario = require('../components/usuario/interface')
const preguntas = require('../components/preguntas/interface')

const routes = function( server ) {
    server.use('/usuario', usuario)
    server.use('/preguntas', preguntas)
}

module.exports = routes