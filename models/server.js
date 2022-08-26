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

     //directorio publico
      this.app.use(express.static('public'));
      this.app.set('view engine', 'ejs');


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