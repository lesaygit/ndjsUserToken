import pool from '../dbConfig.js'

const getAllUsers = async () => {
  const sql = 'SELECT * FROM `user`';
  try {
    const [rows] = await pool.query(sql); // Usa el método query con soporte Promesa
    console.log(rows);
    return rows;
  } catch (err) {
    console.error('Error al realizar la consulta:', err);
    throw new Error('Error de query: ' + err.message);
  }
}

const userExist = async (userName) => {

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


export { getAllUsers, userExist }








