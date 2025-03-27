const jwt = require("jsonwebtoken");
const User = require('../entities/User');
const RefreshToken = require('../entities/RefreshToken');

const { CompareHash } = require("../services/bcryptService");

// Usar entidades y agregar logica de negocio

class UserUseCase {
    constructor(userRepository, refreshTokenRepository) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository
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

        // Tiempo de expiracion
        const tokenExpiresInSeconds = 2 * 60 * 60;
        const refreshTokenExpiresInSeconds = 7 * 24 * 60 * 60;

        const tokenExpiresAtMillis = Date.now() + tokenExpiresInSeconds * 1000
        const refreshTokenExpiresAtMillis = Date.now() + refreshTokenExpiresInSeconds * 1000

        // Verificacion de cuenta
        const passwordVerified = await CompareHash(loginData.password, existingUser.password);
        if (passwordVerified) {

            const token = await jwt.sign({ id: existingUser._id }, "myTotallySecretKey", {
                expiresIn: tokenExpiresInSeconds
            });
            const refreshToken = await jwt.sign({ id: existingUser._id }, "myTotallySecretRefreshKey", {
                expiresIn: refreshTokenExpiresInSeconds
            });

            const refreshTokenModel = new RefreshToken({
                token: refreshToken,
                userId: existingUser._id
            })

            //Guardamos el refresh token
            await this.refreshTokenRepository.create(refreshTokenModel)

            return {
                token: token,
                refreshToken: refreshToken,
                userId: existingUser._id,
                accessTokenExpirationTimestamp: tokenExpiresAtMillis
            };
        }
        else
        {
            throw new Error('The is an error in password');
        }
    }

    async logoutUser(userId) {

        const refreshTokenModel = await this.refreshTokenRepository.findByUserId(userId);
        
        if(!refreshTokenModel) {
            throw new Error("Token not found in database")
        }

        const isTokenDeleted = await this.refreshTokenRepository.deleteById(refreshTokenModel._id);

        if(!isTokenDeleted) return false

        return true
    }

    async refreshToken(refreshTokenModel) {

        const refreshToken = await this.refreshTokenRepository.findByToken(refreshTokenModel.refreshToken);

        if(!refreshToken) {
            throw new Error("Token not found in database")
        }
        
        try {
            const decodedUserIdObj = await jwt.verify(refreshToken.token, "myTotallySecretRefreshKey");
            const userId = decodedUserIdObj.id;

            await this.refreshTokenRepository.deleteById(refreshToken._id);

            const tokenExpiresInSeconds = 2 * 60 * 60;
            const refreshTokenExpiresInSeconds = 7 * 24 * 60 * 60;

            const tokenExpiresAtMillis = Date.now() + tokenExpiresInSeconds * 1000;

            const newAccessToken = jwt.sign({ id: userId }, "myTotallySecretKey", {
                expiresIn: tokenExpiresInSeconds
            });

            const newRefreshToken = jwt.sign({ id: userId }, "myTotallySecretRefreshKey", {
                expiresIn: refreshTokenExpiresInSeconds
            });

            
            const newRefreshTokenModel = new RefreshToken({
                token: newRefreshToken,
                userId: userId
            });

            console.log("newRefreshTokenModel", newRefreshTokenModel)

            await this.refreshTokenRepository.create(newRefreshTokenModel);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expirationTimestamp: tokenExpiresAtMillis
            };
            
        } catch (error) {
            await this.refreshTokenRepository.deleteById(refreshToken._id);
            throw new Error("Refresh token expirado o inválido. Inicia sesión nuevamente.");
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