import express from 'express';
import jwt from 'jsonwebtoken';
import {userExist} from '../DAO/DAO_user.js';

//vars
const router = express.Router();
const secretKey='TDA2020';

//rutas
router.post('/', (req, res) => { 
    const { username, password } = req.body;
    userExist(username,password,(err,userResult)=>{
      if (err) {
        //console.error(err);
		//console.error('usuario no encontrado'); //recuerda que esto sale en la consola del backend del server no en el navegador
        return res.status(500).send({ error: 'Internal Server Error usuario no encontrado' });
      }
      //console.log(userResult);
    if (userResult[0].count > 0) {
      //res.status(200).send({ message: 'User exists' });
      const payload = { username };
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Generar el token
      res.status(200).send({ username, token });
    } else {
      res.status(404).send({ message: 'User not found, usuario no encontrado' });
    }
    });
   
    
});

export default router;