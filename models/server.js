const express = require('express');
const ejs = require('ejs');
const colors = require('colors');

//modulo para hashing de password
const bcryptjs = require('bcryptjs');

//modulo para sesiones
const session = require('express-session');



class Server {

    constructor() {

        this.app = express();
        this.srv_port = process.env.SERVER_PORT;
        
        //Se establece la conexion con la BD
        this.connection = require('../database/db');

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

        

        this.app.use(session({
            secret:'secret',
            resave:true,
            saveUninitialized:true
        }));
        
        //directorio publico
        //this.app.use(express.static('public'));
        this.app.use('/resources', express.static('public'));
        this.app.use('/resources', express.static(__dirname + '/public'));

    }

    routes() {
        //Rutas

        /*this.app.get('/', ( req , res )=>{
            res.render('index',{
                usuario: 'sergio'
            });
           
        });*/

        this.app.get('/login', ( req, res) => {
            res.render('login');
        });

        this.app.get('/register', (req,res) =>{
            res.render('register');
        });

        //Metodo para dar de alta los usuarios
        this.app.post('/register', async (req, res) => {
            const user = req.body.user;
            const name = req.body.name;
            const rol  = req.body.rol;
            const pass = req.body.pass;

            //Se encripta el password a 8 iteraciones
            let passwordHash = await bcryptjs.hash(pass, 8);

            //Se hace la insercion
            this.connection.query('INSERT INTO users SET ?' , {
                user:user, 
                name:name, 
                rol:rol, 
                pass:passwordHash}, async(error, results) => {
                    if(error){
                        console.log(`${error}`.bgRed);
                    } else {
                        res.render('register',{
                            alert:true,
                            alertTitle:"Registration!",
                            alertMessage:'Registrado con Exito',
                            alertIcon:'success',
                            showConfirmButton:false,
                            timer:1500,
                            ruta:''
                        })
                       
                    }
                });
        });


        this.app.post('/auth', async ( req, res) => {
            
            //se obtienen los valores que se registraron desde el login
            const {user, pass} = req.body
            
            let passwordHash = await bcryptjs.hash(pass,8);
            
            if(user && pass) {
                this.connection.query(`SELECT * 
                                       FROM users 
                                       WHERE user = ?`, [user], async(error, results) => {
                                            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass)))
                                            {
                                               res.render('login',{
                                                alert:true,
                                                alertTitle: "Error",
                                                alertMessage: "Usuario y/o password incorrectas",
                                                alertIcon: "error",
                                                showConfirmButton: true,
                                                timer: 1500,
                                                ruta:'login'
                                               });
                                            } else {
                                                req.session.loggedin = true;
                                                req.session.name = results[0].name;
                                                res.render('login',{
                                                    alert:true,
                                                    alertTitle: "Conexion exitosa",
                                                    alertMessage: "Login Correcto",
                                                    alertIcon: "sucess",
                                                    showConfirmButton: false,
                                                    timer: 1500,
                                                    ruta:''
                                                   });
                                            }
                                       })
            }   else {
                res.render('login',{
                    alert:true,
                    alertTitle: "Advertencia",
                    alertMessage: "Por favor ingrese un usuario y/o password",
                    alertIcon: "warning",
                    showConfirmButton: true,
                    timer: 1500,
                    ruta:'login'
                   });
            }        
            
        });


        this.app.get('/', (req,res) =>{
            if(req.session.loggedin){
                res.render('index',{
                    login: true,
                    name: req.session.name
                });
            } else {
                res.render('index',{
                    login: false,
                    name: 'Debe inciar sesion'
                })
            }
        })


        this.app.get('/logout', (req,res)=> {
            req.session.destroy(() =>{
                res.redirect('/');
            });
        })

    }

    listen() {
        this.app.listen(this.srv_port,() => {
            console.log(`Servidor iniciado en http://localhost:',${this.srv_port}`.bgMagenta);
        });
    }

}


module.exports = Server;