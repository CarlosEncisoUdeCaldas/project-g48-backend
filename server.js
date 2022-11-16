const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose"); //variable para la conexion y modelos
const stringConn = require("./data/dbConecction"); //importacion de la cadena de conexion

//instruccion para conectar la base de datos
mongoose.connect(stringConn)
  .then( () => console.log ('Conectado a MongoDB'))
  .catch( (err) => console.log(`Error de conexion: ${err}`))

//Configuracion del BodyParser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//importacion del objeto router para los EndPoints del proyecto
const router = require('./routes/router')

//para que el router funcione hay que darselo en uso a la const app
app.use("/api/v1", router);

//vamos a probar si esto funciona o no
app.listen(port, () => {
  console.log("Servidor funcionando en el puerto " + port);
});
