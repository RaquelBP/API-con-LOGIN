//Intalamos los paquetes:
//npm init -y
//npm i express axios

const express= require("express")
const axios = require("axios")
//npm i axios
const app = express()

const session = require('express-session')
//npm i express-session
//npm i bcrypt
//npm i jsonwebtoken


const hashedSecret = require('./crypto/config.js')
const mainRoutes = require("./routes/users")

const PORT = 3000;

//Configuración de sesión
app.use(
    session({
    secret: hashedSecret, // Clave secreta para firmar el token (debería ser segura, preferiblemente generada con crypto)
    resave: false, // No guardar cambios en la sesión siempre, solo cuando se realice algún cambio
    saveUninitialized: true, // Se guarda la inicialización de la sesión
    cookie: { secure: false }, // Cambia a 'true' si estás utilizando HTTPS
    })
)

//Middleware para manejar datos de formulario y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


app.use("/", mainRoutes)



app.listen(PORT, ()=>{
    console.log("Express está escuchando en el puerto http://localhost:3000")
})