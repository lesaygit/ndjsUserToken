import mysql from 'mysql2';

function handleConnection() {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'ejemplojwt',
      // port: 3306,
      // password: '',
    });
 
   connection.addListener('error', (err) => {
    console.log('Error de mi cnx a mi bd: ', err);

    });
  
  return connection;

};


export default handleConnection;