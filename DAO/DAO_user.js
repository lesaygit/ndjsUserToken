import handleConnection from '../dbConfig.js';


const getAllUsers = () => {

  const connection= handleConnection();
  const sql = 'SELECT * FROM `users` ';

      return new Promise((resolv, reject) => {
         connection.query(sql, (err, rows) => {
          if (err) {
            reject('error de query:'+ err);
            return;
          }
        
          resolv(rows);
    
        });

      });
};

const userExist=(user,pass,callback)=>{
  
  const connection= handleConnection();
  const sql=`SELECT COUNT(*) AS count FROM users WHERE user_name = ? AND password = ?`;
  const values = [user, pass];
  connection.execute(sql, values, (err, rows) => {
    if (err instanceof Error) {
      //console.log(err);
      return callback(err,null);
    }
  
    return callback(null,rows);
    //connection.end();
    
  });
 
};



export {getAllUsers,userExist}








