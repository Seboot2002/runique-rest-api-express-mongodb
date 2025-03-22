// Adapatador de conexiones del db con las entidades de dominio

const { ObjectId } = require("mongodb");
const { MakeHash } = require("../services/bcryptService");

class UserRepository {
    constructor(db) {
        this.collection = db.collection('User');
    }

    async create(user) {

        const result = await this.collection.insertOne({
            email: user.email,
            password: await MakeHash(user.password),
        });
        const userId = result.insertedId;

        const userFound = await this.collection.findOne({
            _id: userId
        });

        return userFound;
    }

    async findById(userId) {

        const result = await this.collection.findOne({ _id: ObjectId.createFromHexString(userId) }, {
            projection: {
                email: 1,
                password: 1,
                _id: 0
            }
        });
        return result;
    }

    async findByEmail(email) {
        return await this.collection.findOne({ email });
    }

    async countByEmail(email) {
        const count = await this.collection.countDocuments({ email: email });
        return count;
    }

    async updateById(userId, userData) {
        
        const dataUpdated = {};

        if (userData.email) {
            dataUpdated.email = userData.email;
        }
        if (userData.password) {
            dataUpdated.password = await MakeHash(userData.password);
        }

        const result = await this.collection.updateOne({ _id: ObjectId.createFromHexString(userId)}, {
            $set: dataUpdated
        });

        return result.matchedCount > 0;
    }

    async deleteById(userId) {
        const result = await this.collection.deleteOne({ _id: ObjectId.createFromHexString(userId) });
        return result.deletedCount > 0;
    }
}

module.exports = UserRepository;