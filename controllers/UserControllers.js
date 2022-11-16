const User = require("../models/UserModel");

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
      newUser.save((error, userSaved) => {
        if (error) {
          res.send({ message: `Error del servidor: ${error}` });
        } else if (userSaved) {
          //sino hay errores entonces podemos guardar el usuario
          res.send({ message: "Usuario creado con éxito" });
        } else {
          res.send({ message: "Usuario no se pudo guardar, error BD" });
        }
      });
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
        User.findByIdAndUpdate(
          idToUpdate,
          userToUpdate,
          { returnDocument: "after" },
          (err, userUpdated) => {
            if (err) {
              res.status(500).send({ message: `Error del servidor: ${err}` });
            } else if (!userUpdated) {
              res.send({ message: "No se pudo actualizar usuario" });
            } else {
              res.send({
                message: "Usuario actualizado correctamente",
                user: userFinded,
              });
            }
          }
        );
      }
    } else if (!userFinded) {
      User.findByIdAndUpdate(
        idToUpdate,
        userToUpdate,
        { returnDocument: "after" },
        (err, userUpdated) => {
          if (err) {
            res.status(500).send({ message: `Error del servidor: ${err}` });
          } else if (!userUpdated) {
            res.send({ message: "No se pudo actualizar usuario" });
          } else {
            res.send({
              message: "Usuario actualizado correctamente",
              user: userFinded,
            });
          }
        }
      );
    } else {
      res.send({ message: "Error del servidor: " + err });
    }
  });
};

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

const deleteUser = (req, res) => {
  const idToDelete = req.params.id;
  //findOneAndRemove();
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

module.exports = {
  createUser,
  updateUser,
  readUser,
  deleteUser,
};
