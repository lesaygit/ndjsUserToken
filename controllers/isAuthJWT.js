import jwt from 'jsonwebtoken';

const secretKey = 'TDA2020';

const authJWTuser = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
     // const token = authHeader.split('espacio')[1];se pica con un espacio del bearer en la posicion 1 para quedarnos con el token
      const token = authHeader.split(' ')[1];
  
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
  
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  
  };

  export default authJWTuser;