const Firestore = require('@google-cloud/firestore');
const MongoClient = require('mongodb').MongoClient;
const DEV_MODE = process.env.NODE_ENV == 'development'

const createDB = async () => {
    if (DEV_MODE) {
        client = await MongoClient.connect('mongodb://localhost:27017')
        return await client.db('local')
    } 

    return db = await new Firestore({
        projectId: 'stockapp-254822',
        keyFilename: '../google-credentials.json'
    });
}

db = createDB();

class User {
    constructor(username, hash, transactions, portfolio) {
        this.username = username;
        this.hash = hash;
        this.transactions = transactions;
        this.portfolio = portfolio;
    }

    static async findOne(username) {
        const user = DEV_MODE ? await db.collection('Users').findOne({username}) : await db.collection('Users').get().data();
        return User(...user);
    } 
}

export default User;