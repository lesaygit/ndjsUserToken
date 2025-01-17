import { getAllUsers, userExist } from '../DAO/DAO_user.js'
import express from 'express'
import { param, validationResult } from 'express-validator'
import pool from '../dbConfig.js'
import authJWTuser from './isAuthJWT.js'

//vars
const router = express.Router();

//rutas
//router.use(authJWTuser);

router.get('/', async (req, res, next) => {     //control user get data, call view witch data...basic controller...
  try {
    const data = await getAllUsers();
    res.status(200).json(data);
  } catch (err) {
    // res.status(500).json({ error: err.message });
    next(err); // Pasa el error al middleware de manejo de errores
  }

});

router.get('/:id',
  param('id').isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send(`Hi user by ID: ${req.params.id}`);

  });

router.post('/', async (req, res) => {

  const { user_name, password_hash, email, token } = req.body;
  try {
    const exist = await userExist(user_name)
    if (exist) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' });
    }

    // Si el usuario no existe, proceder a insertar en la base de datos
    const sql = 'INSERT INTO `user` (`idUser`,`user_name`, `password_hash`, `email`, `token`,`created_at`,`updated_at`) VALUES (NULL,?, ?, ?, ?,current_timestamp(), current_timestamp())';
    const values = [user_name, password_hash, email, token];
    await pool.query(sql, values); // Insertar el nuevo usuario
    // Responder con éxito
    res.status(201).json({ message: 'Usuario creado con éxito.' });
  } catch (err) {
    console.error('Error al agregar usuario:', err);
    res.status(500).json({ error: 'Hubo un error al procesar la solicitud.' });
  }
});

export default router;




