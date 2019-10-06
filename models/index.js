const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: 'stockapp-254822',
    keyFilename:'google-credentials.json'
});

/**
 * User Class for interacting with the database
 */
class User {
    /**
     * Create a user object
     * @param {Object} data - Information about the user
     * @param {String} data.name - Name of the user
     * @param {String} data.name - Email of the user
     * @param {String} data.hash - Hash of the password of the user
     * @param {Array} [data.transactions=[]] - Transactions of the user
     * @param {Object} [data.portfolio={}] - Portfolio of the user
     * @param {Number} [data.cash=5000] - Current cash of the user 
     */
    constructor(data) {
        this.data = data;
        const FieldError = (field) => new Error(`User class instantied without ${field} field`);
        if (data.name === undefined) throw FieldError('name');
        if (data.email === undefined) throw FieldError('email');
        if (data.hash === undefined) throw FieldError('hash');
        if (data.transactions === undefined) this.data.transactions = [];
        if (data.portfolio === undefined) this.data.portfolio = [];
        if (data.cash === undefined) this.data.cash = 5000; 
    }

    /**
     * Adds a new transaction the the user
     * @param {String} symbol
     * @param {Number} price
     * @param {Number} shares
     * @returns {Boolean} Success
     */
    async addTransaction(symbol, price, shares) {
        try {
            this.data.transactions.push(transaction);
            await db.collection('Users').doc(this.data.email).set({
                transactions: this.data.transactions
            }, { merge: true });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async addAssets(asset) {
    }

    /**
     * Inserts this user instance in the database if it does not exist
     * @returns {Boolean} Success
     */
    async insert() {
        try {
            const exists = await User.get(this.data.email);
            if (exists) throw Error('User exists');
            await db.collection('Users').doc(this.data.email).set({...this.data});
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * Retrieves a User instance from the database
     * @param {String} email 
     * @returns {Boolean|User} False if the user was not found else the User instance
     */
    static async get(email) {
        try {
            const user = await db.collection('Users').doc(email).get();
            if (user.exists) return new User(user.data());
            throw Error('User not found');

        } catch (e) { 
            console.error(e);
            return false; 
        } 
    }
};

module.exports = User;