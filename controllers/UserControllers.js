const User = require("../models/UserModel");
const bcrypt = require('bcrypt')
const salt = 'MisionTic2022'
const saltRounds = 10
const jwt = require('../services/TokenGenerator')

//endPoint to create user
const createUser = ({ body }, res) => {
  //desestructuracion del body
  const { firstname, lastname, email, password } = body;

  const newUser = new User({
    firstname: firstname,
    lastname: lastname,
    email: email.toLowerCase(),
    password: password,
  });

  //verificamos que el correo no se repita dentro de la coleccion
  User.findOne({ email: newUser.email }, (err, userFinded) => {
    if (userFinded) {
      res.send({ message: "Existe un usuario con este email" });
    } else if (!userFinded) {
      //ToDo: falta encriptar el password, bcrypt
      const passwordToHash = newUser.password + salt //generacion del password agregando un salt
      bcrypt.hash( passwordToHash, saltRounds, (err, hash) => {
        if(err){
          res.send({ message: 'Error del servidor ' + err})
        }else if(!hash){
          res.send( { message: 'No se pudo encriptar el password'})
        }else{
          newUser.password = hash;
          newUser.save((error, userSaved) => {
            if (error) {
              res.send({ message: `Error del servidor: ${error}` });
            } else if (userSaved) {
              //sino hay errores entonces podemos guardar el usuario
              res.send( { message: "Usuario creado con éxito", status: 200 } );
            } else {
              res.send({ message: "Usuario no se pudo guardar, error BD" });
            }
          });
        }
      })
    } else {
      res.send({ message: `Error del servidor: ${err}` });
    }
  });

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
};

// endPoint to update user
const updateUser = function (req, res) {
  const idToUpdate = req.params.id;
  const { body } = req;
  const userToUpdate = {
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email.toLowerCase(),
    password: body.password,
  };

  //evitar que el email a actualizar exista
  User.findOne({ email: userToUpdate.email }, (err, userFinded) => {
    if (userFinded) {
      if (userFinded.id !== idToUpdate) {
        res.send({
          message: "Ya existe un Usuario con este correo",
          user: userFinded,
        });
      } else {
        userFindAndUpdate(idToUpdate, userToUpdate, res);
      }
    } else if (!userFinded) {
      userFindAndUpdate(idToUpdate, userToUpdate, res);
    } else {
      res.send({ message: "Error del servidor: " + err });
    }
  });
};

//endPoint para lectura de usuarios
const readUser = (req, res) => {
  User.find({}, (err, docs) => {
    if (err) {
      res.status(500).send({ message: `Error del servidor: ${err}` });
    } else if (!res) {
      res.send({ message: "Error de la BD" });
    } else {
      res.send({ docs });
    }
  });
};

//endPoint para eliminar usuario
const deleteUser = (req, res) => {
  const idToDelete = req.params.id;
  User.findOneAndRemove({ _id: idToDelete }, (err, userDeleted) => {
    if (err) {
      res.status(500).send({ message: `Error en la BD: ${err}` });
    } else if (!userDeleted) {
      res.send({ message: "Usuario a eliminar no existe" });
    } else {
      res.send({ message: "Usuario eliminado correctamente" });
    }
  });
};


//ToDo:...Falta funcion para loguear usuario
const userLogin = ( req, res ) => {
  //instrucciones para loguear usuario
  const { body } = req
  const { email , password } = body

  //verificamos si el usuario existe o no
  User.findOne( { email: email.toLowerCase() }, (err, userFinded) => {
    if(err){
      res.send( { message: 'Error del servidor: ' + err } )
    }else if(!userFinded){
      res.send( { message: 'Usuario o Password invalido' } )
    }else {
      //si el usuario fue encontrado verificamos que los password coincidan con la funcion compare de bcrypt
      const passwordToCompare = password + salt //agregamos el valor de salt al password que viene en el body

      bcrypt.compare( passwordToCompare , userFinded.password, (err, result) =>{
        if(err){
          res.send( { message: 'Error del servidor'})
        } else if(!result) {
          res.send ( { message: 'Usuario o Password invalido' } )
        } else {
          //creamos el token del usuario
          const token = jwt.createAccessToken(userFinded)
          res.send( { accessToken: token } )
        }
      })

    }
  } )
}

//funcion auxiliar para optimizar el update del user
const userFindAndUpdate = (id, update, res) => {
  User.findByIdAndUpdate(id, update, { new: true }, (err, userUpdated) => {
    if (err) {
      res.status(500).send({ message: `Error del servidor: ${err}` });
    } else if (!userUpdated) {
      res.send({ message: "No se pudo actualizar usuario" });
    } else {
      res.send({
        message: "Usuario actualizado correctamente",
        user: userUpdated,
      });
    }
  });
};


module.exports = {
  createUser,
  updateUser,
  readUser,
  deleteUser,
  userLogin,
};
