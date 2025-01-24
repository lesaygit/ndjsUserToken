//DTO (Data Transfer Object)
import { getUsers, createUser, editUser, deletUser, getUsersId } from '../DAO/DAO_user.js'

const getAllUsersService = async () => {
    const rows = await getUsers();

    if (rows.length === 0) {
        console.warn('No se encontraron usuarios.');
        return [];
    }

    return rows.map(row => ({
        idUser: row.idUser,
        name: row.user_name,
        email: row.email,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
    }));

};

const createNewUserService = async (user) => {
    // Reglas de negocio adicionales podrían ir aquí
    try {
        // Llamada al DAO para crear el usuario
        const result = await createUser(user);
        return {
            success: true,
            message: 'Usuario creado exitosamente.',
            userId: result.insertId,
        };
    } catch (err) {
        console.error('Error en el servicio al crear usuario:', err);
        throw new Error('Error al procesar la creación del usuario.');
    }
}

const editUserService = async (userId, userData) => {
    try {
        const result = await editUser(userId, userData); // Llamar al método DAO para editar el usuario

        if (result.affectedRows === 0) {
            throw new Error('No se encontró el usuario para actualizar.');
        }

        // 4. Devolver la respuesta con éxito
        return { success: true, message: 'Usuario actualizado exitosamente.' };
    } catch (err) {
        console.error('Error al actualizar el usuario:', err);
        throw new Error('Hubo un error al procesar la solicitud.');
    }
};

const getUserIdSercice = async (idUser) => {
    console.log('mi id de usuario:', idUser);
    const row = await getUsersId(idUser);
    console.log('desde service:', row)

    if (row.length === 0) {
        console.warn('No se encontraron usuarios.');
        return [];
    }

    return row.map(row => ({
        idUser: row.idUser,
        name: row.user_name,
        email: row.email,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
    }));




}

const deletUserService = async (idUser) => {
    //accesar al DAO y eliminar un usuario
    //procesar la resuesta que sera enviada al control
    try {
        const result = await deletUser(idUser);
        if (result.affectedRows === 0) {
            throw new Error('No se encontró el usuario para eliminar.');
        }

        // 4. Devolver la respuesta con éxito
        return { success: true, message: 'Usuario se ha eliminado exitosamente.' };
    } catch (err) {
        console.error('Error al eliminar el usuario:', err);
        throw new Error('Hubo un error al procesar la solicitud.');

    }
}

export { getAllUsersService, createNewUserService, editUserService, getUserIdSercice, deletUserService }