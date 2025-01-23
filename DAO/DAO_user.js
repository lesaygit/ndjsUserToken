//DAO data acces object maneja todo el acceso a la BD, solo eso.
import pool from '../dbConfig.js'

const getUsers = async () => {
  const sql = 'SELECT * FROM user';
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (err) {
    console.error('Error al realizar la consulta:', err);
    throw new Error('Error de query: ' + err.message);
  }
}

const getUsersId = async (idUser) => {
  
  const sql = 'SELECT * FROM user WHERE user.idUser=?';
  const value=[idUser];
  
  try {
    const [rows] = await pool.query(sql,value);
    return rows;
  } catch (err) {
    console.error('Error al realizar la consulta:', err);
    throw new Error('Error de query: ' + err.message);
   
  }
}

const createUser = async (userNew) => {

  const sql = `INSERT INTO user (user_name,password_hash,email) VALUES (?,?,?)`;
  const values = [userNew.user_name, userNew.password_hash, userNew.email];

  try {
    const [result] = await pool.query(sql, values);
    return result.insertId;

  } catch (err) {
    console.error('Error al crear usuario:', err);
    throw new Error('Error en la consulta (createUser):' + err.message);
  }
}

const editUser = async (userId, userData) => {
 
  const { user_name, password_hash, email } = userData;
  const values = [user_name, password_hash, email, userId];
  const sql = `UPDATE user SET user_name=?,password_hash=?, email=? WHERE user.idUser=?`;

  try {
    const [result] = await pool.query(sql, values);
    return result.affectedRows;

  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    throw new Error('Error en la consulta: ' + err.message);
  }

}

const deletUser = async (userId) => {
  const sql = `DELETE FROM user WHERE user.idUser = ?`;
  const value = [userId];//hacemos esto porque mysql2 pide los valores por parametros en un array.
  try {
    const [result] = await pool.query(sql, value);
    //return result.affectedRows;
    return result;//el resiltado lo manejaremos en DTO

  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    throw new Error('Error en la consulta: ' + err.message);
  }

}

const existUser = async (userName) => {

  const sql = `SELECT COUNT(*) AS count FROM user WHERE user_name = ?`;
  const value = [userName];

  try {
    const [rows] = await pool.query(sql, value); // Usa query en lugar de execute para compatibilidad con pool
    const userCount = rows[0]?.count || 0; // Obtiene el conteo desde el resultado
    return userCount > 0; // Devuelve true si el usuario existe, de lo contrario false
  } catch (err) {
    console.error('Error al verificar existencia de usuario:', err);
    throw new Error('Error en la consulta: ' + err.message);

  }
}


export { getUsers, createUser, editUser, deletUser, getUsersId, existUser }








