const { ObjectId } = require("mongodb");

class RefreshTokenRepository {

    constructor(db) {
        this.collection = db.collection('RefreshToken');
    }

    async create(refreshToken) {

        const result = await this.collection.insertOne({
            token: refreshToken.token,
            userId: ObjectId.isValid(refreshToken.userId) ? refreshToken.userId : ObjectId.createFromHexString(refreshToken.userId)
        });
        const refreshTokenId = result.insertedId;

        const refreshTokenFound = await this.collection.findOne({
            _id: refreshTokenId
        });

        return refreshTokenFound;
    }

    async findByUserId(userId) {

        const result = await this.collection.findOne({ 
            userId: ObjectId.createFromHexString(userId) 
        });
        
        return result;
    }

    async findByToken(refreshToken) {

        const result = await this.collection.findOne({ token: refreshToken });

        return result;
    }

    async findById(refreshTokenId) {

        const result = await this.collection.findOne({ _id: ObjectId.createFromHexString(refreshTokenId) }, {
            projection: {
                _id: 0
            }
        });
        return result;
    }

    async updateById(refreshTokenId, refreshTokenData) {
        
        const dataUpdated = {};

        if (refreshTokenData.token) {
            dataUpdated.token = refreshTokenData.token;
        }

        const result = await this.collection.updateOne({ _id: ObjectId.createFromHexString(refreshTokenId)}, {
            $set: dataUpdated
        });

        return result.matchedCount > 0;
    }

    async deleteById(refreshTokenId) {

        const refreshTokenIdValid = ObjectId.isValid(refreshTokenId) ? refreshTokenId : ObjectId.createFromHexString(refreshTokenId)

        const result = await this.collection.deleteOne({ _id: refreshTokenIdValid });
        return result.deletedCount > 0;
    }
}

module.exports = RefreshTokenRepository