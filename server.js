const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose"); //variable para la conexion y modelos
const stringConn = require("./data/dbConecction"); //importacion de la cadena de conexion

//importamos el modelo User
const User = require("./models/UserModel");

//instruccion para conectar la base de datos
mongoose.connect(stringConn);

//Configuracion del BodyParser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//declaracion del objeto tipo router para los EndPoints del proyecto
const router = express.Router();

//Operaciones CRUD
//ruta raiz de prueba
router.get("/", (req, res) => {
  res.send("<h1>Hola Mundo</h1>");
});

//Create User - EndPoint de la api rest createUser
router.post("/createUser", async ({ body }, res) => {
  //desestructuracion del body
  const { firstname, lastname, email, password } = body;

  const newUser = new User({
    firstname: firstname,
    lastname: lastname,
    email: email.toLowerCase(),
    password: password,
  });

  //verificamos que el correo no se repita dentro de la coleccion
  User.findOne( { email: newUser.email }, (err, userFinded) => {
    if(userFinded){
        res.send( { message: 'Existe un usuario con este email' } )
    }else if(!userFinded){
        //ToDo: falta encriptar el password, bcrypt
        newUser.save( (error, userSaved) => {
            if (error) {
              res.send({ message: `Error del servidor: ${error}` });
            } else if (userSaved) {
              //sino hay errores entonces podemos guardar el usuario
              res.send({ message: "Usuario creado con éxito" });
            } else {
              res.send({ message: "Usuario no se pudo guardar, error BD" });
            }
          });
    }else{
        res.send({ message: `Error del servidor: ${err}`})
    }
   } )

  //Hay 4 formas de utilizar los metodos queries de mongoose
  //opcion 1: retorna undefined, mas sencilla
  // newUser.save()

  // opcion 2: usar una funcion callback como parametro, es la que vamos a usar
//   newUser.save((error, userSaved) => {
//     if (error) {
//       res.send({ message: `Error del servidor: ${error}` });
//     } else if (userSaved) {
//       //sino hay errores entonces podemos guardar el usuario
//       res.send({ message: "Usuario creado con éxito" });
//     } else {
//       res.send({ message: "Usuario no se pudo guardar, error BD" });
//     }
//   });

  //opcion 3: usar una promesa para guardar el nuevo usuario
  //   newUser
  //     .save()
  //     .then( (userSaved) => res.send( { message: "Usuario creado con éxito", user: userSaved } ) )
  //     .catch( (error) => res.status(500).send( { message: `Error del servidor: ${error}` } ) );

  //Opcion 4: usando promesas con el async y await
  //   const result = await newUser.save();
  //   res.send(result);
});

//Update User - EndPoint para crear un user
router.put('/updateUser/:id', function ( req, res ) { 
    const idToUpdate = req.params.id
    const { body } = req
    const userToUpdate = {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email.toLowerCase(),
        password: body.password
    }

    //evitar que el email a actualizar exista
    User.findOne( { email: userToUpdate.email }, ( err, emailFinded) => {
        if(emailFinded){
            res.send( { message: 'Ya existe un Usuario con este correo'})
        }else if(!emailFinded){
            User.findByIdAndUpdate( idToUpdate , userToUpdate, (err, userUpdated ) => {
                if(err){
                    res.status(500).send( { message: `Error del servidor: ${err}`})
                }else if(!userUpdated){
                    res.send( { message: 'No se pudo actualizar usuario'})
                }else{
                    res.send( { message: 'Usuario actualizado correctamente'})
                }
            } )
        }else{
            res.send( { message: 'Error del servidor: ' + err } )
        }
    } )

})

//Delete User - ToDo..
//Read Users - ToDo..

//para que el router funcione hay que darselo en uso a la const app
app.use("/api/v1", router);

//vamos a probar si esto funciona o no
app.listen(port, () => {
  console.log("Servidor funcionando en el puerto " + port);
});
