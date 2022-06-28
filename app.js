const path = require('path');

const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');




const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
app.use(express(JSON));


//USAR LAS COOKIES
app.use(cookieParser());


//Middleware
app.use(express.static(__dirname + '/public'));

app.use("/images", express.static("images"))

app.use('/', require('./router/router'))


//CONTROLADOR DE LOGIN
const authController = require('./controllers/authController');
const exp = require('constants');


app.get('/', authController.isAuthenticated, (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/index.html'))
})

app.get('/producto', authController.isAuthenticated, (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/producto.html'))
})

app.get('/producto/categoria', authController.isAuthenticated, (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/producto/categoria.html'))
})

app.get('/producto/unidad', authController.isAuthenticated, (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/producto/unidad.html'))
})


//MODULO USUARIO
app.get('/usuarios', authController.isAuthenticated, (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/usuarios.html'))
})

// MODULO VENTA
app.get('/ventas', authController.isAuthenticated, (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/ventas.html'))
})

// MODULO CONFIGURACION
app.get('/configuracion', authController.isAuthenticated, (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/configuracion.html'))
})

//MODULO NEGOCIO
app.get('/negocio', authController.isAuthenticated, (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/negocio.html'))
})


//SECCION INFORMES
app.get('/informes/graficos', authController.isAuthenticated, (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/informes/graficos.html'))
})

app.get('/informes/tablas', authController.isAuthenticated, (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/informes/tablas.html'))
})

app.get('/informes/informe1', (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/informes/informe1.html'))
})

app.get('/informes/informe2', (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/informes/informe2.html'))
})

app.get('/informes/informe3', (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/informes/informe3.html'))
})
app.get('/informes/informe4', (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/informes/informe4.html'))
})
app.get('/informes/informe5', (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/informes/informe5.html'))
})

app.get('/informes/informe6', (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/informes/informe6.html'))
})

app.get('/informes/informeventas', (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/informes/informeVentas.html'))
})


//LOGIN
app.get('/login', (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/login.html'))
})

app.get('/sesion_fallida', (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/html/sesion_fallida.html'))
})



//SETEAR VARIABLES DE ENTORNO
dotenv.config( { path: './env/.env'});




app.use(function(req,res,next){
    if(!req.user)
        res.header('Cache-control','private, no-cache, no-store, must-revalidate');
    next();
})


app.listen(3000, ()=>{
    console.log('server escuchando');
})