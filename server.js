const express = require('express');
const app = express();
const port = 3001
const mongoose = require('mongoose') //variable para la conexion y modelos
const stringConn = require('./data/dbConecction') //importacion de la cadena de conexion

//importamos el modelo User
const User = require('./models/UserModel')

//instruccion para conectar la base de datos
mongoose.connect(stringConn)

//Configuracion del BodyParser
app.use( express.urlencoded( { extended: true } ) )
app.use ( express.json() )

//declaracion del objeto tipo router para los EndPoints del proyecto
const router = express.Router();

//Operaciones CRUD
//ruta raiz de prueba
router.get("/", ( req, res ) => {
    res.send('<h1>Hola Mundo</h1>')
})

//Create User - ToDo...
router.post("/createUser", ( { body } , res) => {
    //desestructuracion del body
    const { firstname, lastname, email, password } = body 
    
    const newUser = new User({
        firstname: firstname,
        lastname: lastname,
        email: email.toLowerCase() ,
        password: password
    } )

    newUser.save()
    res.send( { message: 'Usuario creado con éxito', user: newUser} )

})
//Edit User - ToDo..
//Delete User - ToDo..
//Read Users - ToDo..

//para que el router funcione hay que darselo en uso a la const app
app.use("/api/v1", router)

//vamos a probar si esto funciona o no
app.listen( port , () => {
    console.log('Servidor funcionando en el puerto '+ port)
})