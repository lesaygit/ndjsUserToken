//DAO data acces object maneja todo el acceso a la BD, solo eso.
import pool from '../dbConfig.js';
import bcrypt from "bcrypt";


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
  const value = [idUser];

  try {
    const [rows] = await pool.query(sql, value);
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

const checkUser = async (userName, password) => {

  try {
    const sql = `SELECT idUser, user_name, password_hash FROM user WHERE user_name = ?`;
    const [rows] = await pool.query(sql, [userName]);
    // Verificar si el usuario existe
    if (rows.length === 0) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    const user = rows[0]; // El usuario encontrado
    const hash = user.password_hash;
    // Verificar la contraseña ingresada contra el hash almacenado
    const isPasswordValid = await bcrypt.compare(password, hash);
    if (!isPasswordValid) {
      return { success: false, message: 'Contraseña incorrecta' };
    }

    // Si todo está bien, devolver datos del usuario
    return {
      success: true,
      message: 'Usuario autenticado con éxito',
      userId: user.idUser,
      userName: user.user_name
    };
  } catch (err) {
    console.error('Error en la autenticación:', err);
    throw new Error('Error al verificar el usuario: ' + err.message);
  }
}


export { getUsers, createUser, editUser, deletUser, getUsersId, checkUser }








