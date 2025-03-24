const UserUseCase = require("../usecases/user.usecase");

class UserController {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.userUseCase = new UserUseCase(this.userRepository);
    }

    async createUser(req, res) {
        
        try {
            let user = await this.userUseCase.createUser(req.body);

            res.status(201).json(user);

        } catch (error) {

            if (error.message === 'A user with this email already exists') {
                res.status(409).json({ error: error.message });
            }
            else if (error.message === "Email and password are required"){
                res.status(409).json({ error: error.message });
            } 
            else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async loginUser(req, res) {

        try {
            let loginResult = await this.userUseCase.loginUser(req.body);

            res.status(201).json({
                accessToken: loginResult.token, 
                refreshToken: loginResult.token, 
                accessTokenExpirationTimestamp: loginResult.accessTokenExpirationTimestamp,
                userId: loginResult.userId
            });

        } catch (error) {
            if (error.message === 'A user with this email already exists') {
                res.status(409).json({ error: error.message });
            }
            else if (error.message === "Email and password are required"){
                res.status(409).json({ error: error.message });
            } 
            else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async logoutUser(req, res) {

        try {
            
            res.status(201).send("Token erased")

        } catch (error) {
            if (error.message === 'A user with this email already exists') {
                res.status(409).json({ error: error.message });
            }
            else if (error.message === "Email and password are required"){
                res.status(409).json({ error: error.message });
            } 
            else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async getData(req, res) {

        try {
            const userId = req.token_usuarioId;
            const user = await this.userUseCase.getUserData(userId);

            res.status(201).send(user);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateUser(req, res) {

        try {
            const userId = req.token_usuarioId;
            const check = await this.userUseCase.updateUser(userId, req.body);

            if (check){
                res.status(201).send("User updated");
            }

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {

        try {
            const userId = req.token_usuarioId;
            const check = await this.userUseCase.deleteUser(userId);

            if (check){
                res.status(201).send("User deleted");
            }

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = UserController;