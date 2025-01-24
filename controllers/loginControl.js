import express from 'express';
import jwt from 'jsonwebtoken';
import { checkUser } from '../DAO/DAO_user.js';

//vars
const router = express.Router();
const secretKey = 'TDA2020';

//rutas
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const result = await checkUser(username,password);

  if (result.success) {
    const payload = { username };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Generar el token
    res.status(200).send({ username, token });

  } else {
    res.status(404).send({ message: 'User not found, usuario no encontrado' });
  }
});

export default router;