import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import userControl from './controllers/userControl.js';
import loginControl from './controllers/loginControl.js'


//vars
const app = express();
const port = 3000;
const pathBase = path.dirname(new URL(import.meta.url).pathname);

//middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //recuerda true para obj comlejos 

//ruta
app.get('/', (req, res) => { res.send('Hello main API RES Get acces to user list express from node.js 😎.') });
app.use('/login', loginControl);
app.use('/users', userControl);

//middleware para rutas desconocidas

//server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});