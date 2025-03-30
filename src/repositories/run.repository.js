// Adapatador de conexiones del db con las entidades de dominio

const { ObjectId } = require("mongodb");
const { MakeHash } = require("../services/bcryptService");

class RunRepository {
    constructor(db) {
        this.collection = db.collection('Run');
    }

    async create(run, userId) {

        const result = await this.collection.insertOne({
            _id: ObjectId.createFromHexString(run.id),
            dateTimeUtc: run.dateTimeUtc, 
            durationMillis: run.durationMillis, 
            distanceMeters: run.distanceMeters, 
            lat: run.lat, 
            long: run.long, 
            avgSpeedKmh: run.avgSpeedKmh, 
            maxSpeedKmh: run.maxSpeedKmh, 
            totalElevationMeters: run.totalElevationMeters,
            userId: ObjectId.createFromHexString(userId)
        });

        console.log("resultCreateRun", result)

        const runId = result.insertedId;
        console.log("runId", runId);

        const runFound = await this.collection.findOne({
            _id: runId
        });

        return runFound;
    }

    async findById(runId) {

        const result = await this.collection.findOne({ _id: ObjectId.createFromHexString(runId) }, {
            projection: {
                _id: 0
            }
        });
        return result;
    }

    async findAllById(userId) {

        const cursor = await this.collection.find({ userId: ObjectId.createFromHexString(userId) }, {
            projection: {
                _id: 0
            }
        });

        const runsArray = await cursor.toArray();

        return runsArray;
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

module.exports = RunRepository;