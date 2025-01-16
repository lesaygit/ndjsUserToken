import {getAllUsers} from '../DAO/DAO_user.js';
import express from 'express';
import authJWTuser from './isAuthJWT.js'

//vars
const router = express.Router();

//rutas
router.use(authJWTuser);

router.get('/', async(req, res) => {     //control user get data, call view witch data...basic controller...
  try {
    const data = await getAllUsers();
    res.json(data);
    //console.log(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

router.get('/:id', (req, res) => {
  res.end(`Hi user by param:${req.params.id}`)
});

router.post('/', (req, res) => {
  res.end('hi Post user')
});

export default router;




