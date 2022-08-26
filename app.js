//Se establece la ruta para variables de entorno
require('dotenv').config({path:'env/.env'});

const Server = require('./models/server');

const server = new Server;

server.listen();



