const jwt = require("jsonwebtoken");
const User = require('../entities/User');

const { CompareHash } = require("../services/bcryptService");

// Usar entidades y agregar logica de negocio

class UserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser(userData) {

        if (!userData.email || !userData.password) {
            throw new Error('Email and password are required');
        }

        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('A user with this email already exists');
        }

        const userModel = new User(userData);

        if (!userModel.isValidEmail()) {
            throw new Error('Invalid email');
        }

        const finalUser = await this.userRepository.create(userModel);
        return finalUser;
    }

    async loginUser(loginData) {

        if (!loginData.email || !loginData.password) {
            throw new Error('Email and password are required');
        }

        const existingUser = await this.userRepository.findByEmail(loginData.email);
        if (!existingUser) {
            throw new Error('User do not exist');
        }

        const passwordVerified = await CompareHash(loginData.password, existingUser.password);
        if (passwordVerified) {

            const token = await jwt.sign({ id: existingUser._id }, "myTotallySecretKey", {
                expiresIn: '2h'
            });

            return {
                token: token,
                userId: existingUser._id
            };
        }
        else
        {
            throw new Error('The is an error in password');
        }
    }

    async getUserData(userId){

        const user = await this.userRepository.findById(userId);

        return user;
    }

    async updateUser(userId, userData){

        const check = await this.userRepository.updateById(userId, userData);

        return check;
    }

    async deleteUser(userId){

        const check = await this.userRepository.deleteById(userId);

        return check;
    }
}

module.exports = UserUseCase;