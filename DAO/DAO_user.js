import pool from '../dbConfig.js'
//DAO data acces object maneja todo el acceso a la BD.

const getUsers = async () => {
  const sql = 'SELECT * FROM `user`';
  try {
    const [rows] = await pool.query(sql); // Usa el método query con soporte Promesa
    //console.log(rows);
    return rows;
  } catch (err) {
    console.error('Error al realizar la consulta:', err);
    throw new Error('Error de query: ' + err.message);
  }
}

const createUser= async(user)=>{
 const sql =`INSERT INTO user (user_name,password_hash,email) VALUES (?,?,?)`;
 const values = [user.user_name, user.password_hash, user.email];

 try {
  const [result]=await pool.query(sql,values);
  return result.insertId;
  
 } catch (err) {
  console.error('Error al crear usuario:', err);
  throw new Error('Error en la consulta: ' + err.message);
 }
}

const editUser=async(user)=>{

  const values = [ user.user_name, user.password_hash, user.email,user.idUser];
  const sql=`UPDATE user SET user_name=?,password_hash=?, email=? WHERE user.idUser=?`;
  try {
    const [result]=await pool.query(sql,values);
    return result.affectedRows;
    
   } catch (err) {
    console.error('Error al actualizar usuario:', err);
    throw new Error('Error en la consulta: ' + err.message);
   }

}

const deletUser=async(id)=>{

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


export { getUsers, createUser, editUser, deletUser, existUser }








