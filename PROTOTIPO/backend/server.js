const express = require('express')
const body_parser = require('body-parser')
const path = require('path');
const config = require('./config')
const routes = require('./network/routes')
const db = require('./db')

var app = express()

db( config.DB_URL )

app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
  });

  app.use('/audio', express.static('../audio/angry-birds-videojuegos-.mp3'));

  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; frame-src 'self' https://www.youtube.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://code.jquery.com https://cdn.jsdelivr.net https://maxcdn.bootstrapcdn.com; style-src 'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com; img-src 'self' data: blob:; connect-src 'self';"
    );
    next();
  }); 

app.use( body_parser.json() )
app.use( body_parser.urlencoded({extended:false}) )

//app.use(express.static(path.join(__dirname)));

app.use(express.static(path.join(__dirname,'..', 'frontend')));

// Ruta para el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'frontend', 'advjuego.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'..', 'frontend', 'datosp.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'..', 'frontend', 'datosmaestro.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'..', 'frontend', 'Tabla.html'));
});

routes( app )

app.listen( config.PORT )
console.log(`La aplicacion se encuentra arriba en http://localhost:${config.PORT}`)