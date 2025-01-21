import { getUsers, createUser, editUser, deletUser, existUser } from '../DAO/DAO_user.js'
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
    const data = await getUsers();
    res.status(200).json(data);
  } catch (err) {
    // res.status(500).json({ error: err.message });
    next(err); // Pasa el error al middleware de manejo de errores
  }

});

//detalles de un usuario por id
router.get('/:id',
  param('id').isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send(`Hi user by ID: ${req.params.id}`);

});

//crear un usuario nuevo
router.post('/', async (req, res) => {

  const { user_name, password_hash, email } = req.body;

  try {
    const exist = await existUser(user_name)
    if (exist) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' })
    }

    const newUser = new User(user_name, password_hash, email);
    newUser.isValid();

    const saltRounds = 10;
    newUser.password_hash = await bcrypt.hash(newUser.password_hash, saltRounds)

    const userId = createUser(newUser);
    return res.status(201).json({ message: 'Usuario creado exitosamente.', userId });

  } catch (err) {
    console.error('Error al agregar usuario:', err);
    res.status(500).json({ error: 'Hubo un error al procesar la solicitud.' });
  }
});

//editar un usuario existente
router.put('/', async (req, res) => {
  const { user_name, password_hash, email, idUser } = req.body;
  try {
    const updateUser = new User(user_name, password_hash, email, idUser);
    const updatedRows = await editUser(updateUser);
    return res.status(201).json({ message: 'Usuario actualizado exitosamente.' });

  } catch (err) {
    console.error('Error al agregar usuario:', err);
    res.status(500).json({ error: 'Hubo un error al procesar la solicitud.' });

  }

})

//eliminar un usuario existente
router.delete('/:id',
  param('id').isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send(`Hi user by ID: ${req.params.id}`);

});

export default router;




