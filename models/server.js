const express = require('express');
const ejs = require('ejs');
const colors = require('colors');


class Server {

    constructor() {

        this.app = express();
        this.srv_port = process.env.SERVER_PORT;

        this.middleware();

        this.routes();
    }

    middleware() {

        
        //Seteamos urlencoded para capturar datos de formulario
        this.app.use(express.urlencoded({extended:false}));
        
        //Establecer el manejo de archivos JSON
        this.app.use(express.json());
        
        //Establecer el motor de plantillas
        this.app.set('view engine', 'ejs');
        
        //directorio publico
        //this.app.use(express.static('public'));
        this.app.use('/resources', express.static('public'));
        this.app.use('/resources', express.static(__dirname + '/public'));

    }

    routes() {
        //Rutas

        this.app.get('/', ( req , res )=>{
            res.render('index');
        });

    }

    listen() {
        this.app.listen(this.srv_port,() => {
            console.log(`Servidor iniciado en http://localhost:',${this.srv_port}`.bgMagenta);
        });
    }

}


module.exports = Server;