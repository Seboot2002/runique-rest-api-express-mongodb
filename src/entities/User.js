class UserModel {
    constructor({ email, password }) {
        
        this.email = email;
        this.password = password;
    }

    isValidEmail() {
        return /\S+@\S+\.\S+/.test(this.email);
    }
}

module.exports = UserModel;