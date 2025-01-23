class User {
    constructor({idUser = null, user_name, password_hash, email, status = null, created_at = null, updated_at = null}) {
        this.idUser = idUser;
        this.user_name = user_name;
        this.password_hash = password_hash;
        this.email = email;
        this.status=status;
        this.created_at=created_at;
        this.updated_at=updated_at;
    }
    isValid() {
        if (!this.user_name || this.user_name.trim().length < 3) {
            throw new Error('El nombre de usuario debe tener al menos 3 caracteres.');
        }
        if (!this.password_hash || this.password_hash.trim().length < 3) {
            throw new Error('La contraseña debe tener al menos 3 caracteres.');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email)) {
            throw new Error('El correo electrónico no es válido.');
        }
        return true; // Si no hay errores, el usuario es válido
    }

}
export default User;