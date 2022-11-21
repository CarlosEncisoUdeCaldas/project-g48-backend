const express = require('express');
const { createUser, updateUser, readUser, deleteUser, userLogin } = require('../controllers/UserControllers');
const router = express.Router();
//importamos el modelo User
const User = require("../models/UserModel");

//Operaciones CRUD
//ruta raiz de prueba
router.get("/", (req, res) => {
    res.send("<h1>Hola Mundo</h1>");
  });
  
  //CRUD Usuario 
  router.post("/createUser", createUser);
  router.put('/updateUser/:id', updateUser )
  router.get('/getUsers', readUser )
  router.delete('/deleteUser/:id', deleteUser )
  
  router.post("/log-in", userLogin); //ruta para loguear usuario

  //exportamos al objeto router
  module.exports = router