import { getUsers, createUser, editUser, deletUser, existUser } from '../DAO/DAO_user.js'
import { getAllUsersService, createNewUserService, editUserService, getUserIdSercice, deletUserService } from '../services/userservice.js'
import express from 'express'
import { param, validationResult } from 'express-validator'
import pool from '../dbConfig.js'
import User from '../model/user.js'
import authJWTuser from './isAuthJWT.js'
import bcrypt from "bcrypt";

//vars
const router = express.Router();

//rutas
//router.use(authJWTuser);

//mostar todos los usuarios
router.get('/', async (req, res, next) => {     //control user get data, call view witch data...basic controller...
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (err) {
    // res.status(500).json({ error: err.message });
    next(err); // Pasa el error al middleware de manejo de errores
  }

});

//detalles de un usuario por id
router.get('/details/:id',
  param('id').isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;
    console.log('id desde control', userId);
    //res.send(`Hi user by ID: ${req.params.id}`);
    try {
      const user = await getUserIdSercice(userId);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
      //next(err); // Pasa el error al middleware de manejo de errores
    }
  });

//crear un usuario nuevo
router.post('/new', async (req, res) => {

  const { user_name, password_hash, email } = req.body;


  //aqui yo creo mejor un util con los metodos necesarios antes de crear un objeto yo creo que es mejor validar todos los datos que llegan del front o solicitud

  //validando distinto de null o undefine
  const requiredFields = { user_name, password_hash, email };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value?.trim()) {
      return res.status(400).json({ error: `El campo ${key} es requerido.` });
    }
  }

  //validar los datos name pass y email antes de crear un objeto user

  //si los datos son validos verificar que no existan duplicados en la bd para name y email


  try {
    const exist = await existUser(user_name)//estender metodo tambien para email o crear otro o meor hacer un metodo generico que compruebe si el valor pasado existe en la bd
    if (exist) { return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' }) }

    const newUser = new User({ user_name, password_hash, email });
    newUser.isValid();//quitar esa responsabilida de hay, al crear un user los datos deben estar validados

    const saltRounds = 10;
    newUser.password_hash = await bcrypt.hash(newUser.password_hash, saltRounds);

    const result = await createNewUserService(newUser);
    return res.status(201).json(result);

  } catch (err) {
    console.error('Error al agregar usuario:', err);
    res.status(500).json({ error: 'Hubo un error al procesar la solicitud.' });
  }
});

//editar un usuario existente
router.put('/edit/:userId',
  param('userId').isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.userId; // Obtener el userId desde los parámetros de la URL
    const userData = req.body; // Obtener los datos actualizados desde el cuerpo de la solicitud

    try {
      // const updateUser = new User(user_name, password_hash, email, idUser);
      const result = await editUserService(userId, userData);
      return res.status(200).json(result);

    } catch (err) {
      console.error('Error al editar usuario:', err);
      res.status(500).json({ error: 'Hubo un error al procesar la solicitud.' });

    }

  })

//eliminar un usuario existente
router.delete('/delete/:id',
  param('id').isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo'),
  async (req, res) => {
    //valido id valido
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const idDelet = req.params.id;
    try {
      const result = await deletUserService(idDelet);
      return res.status(200).json(result);

    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      res.status(500).json({ error: 'Hubo un error al procesar la solicitud.' });

    }

  });

export default router;




