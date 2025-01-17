import handleConnection from '../dbConfig.js';

const getAllUsers = () => {

  const connection = handleConnection();
  const sql = 'SELECT * FROM `users` ';

  return new Promise((resolv, reject) => {
    connection.query(sql, (err, rows) => {
      if (err) {
        reject('error de query:' + err);
        return;
      }

      resolv(rows);

    });

  });
};

const userExist = (userName, callback) => {

  const cnx = handleConnection();
  const sql = `SELECT COUNT(*) AS count FROM user WHERE user_name = ?`;
  const value = [userName];

  cnx.execute(sql, value, (err, rows) => {
    if (err) {
      return callback(err, null);
    }

    const userCount = rows[0]?.count || 0;
    callback(null, userCount > 0);
  });
};



export { getAllUsers, userExist }








