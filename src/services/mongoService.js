require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;

let db;

async function connect() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db(process.env.DB_NAME || 'YourDbName');
        console.log('MongoDB Connected');
        
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
}

function getDb() {
    if (!db) {
        throw new Error('No database connection');
    }
    return db;
}

module.exports = { connect, getDb };