//Se establece la ruta para variables de entorno
require('dotenv').config({path:'env/.env'});

const express = require('express');
const app = express();

const srv_port = process.env.SERVER_PORT;

//directorio publico
app.use(express.static('public'));

//Rutas

app.get('/', ( req , res )=>{
    res.send('Hola cucho');
});

app.listen(srv_port,() => {
    console.log('Servidor iniciado en http://localhost:',srv_port);
});

