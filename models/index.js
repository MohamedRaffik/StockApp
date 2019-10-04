const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: 'stockapp-254822',
    keyFilename:'google-credentials.json'
});

class User {
    constructor(username, hash, transactions, portfolio, cash) {
        this.username = username;
        this.hash = hash;
        this.transactions = transactions === undefined ? [] : transactions;
        this.portfolio = portfolio === undefined ? [] : portfolio;
        this.cash = cash === undefined ? 5000 : cash
    }

    async addTransactions(transactions) {
        try {
            this.transactions.concat(transactions);
            await db.collection('Users').doc(this.username).set({
                transactions: this.transactions
            }, { merge: true });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async addAssets(asset) {
    }

    async insert() {
        try {
            const exists = await User.findOne(this.username);
            if (exists) throw Error('User exists');
            await db.collection('Users').doc(this.username).set({
                username: this.username,
                hash: this.hash,
                transactions: this.transactions,
                portfolio: this.portfolio,
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async get(username) {
        try {
            const user = await db.collection('Users').doc(username).get();
            if (user.exists) return user.data();
            return false

        } catch (e) { 
            console.log(e);
            return false; 
        } 
    }
};

module.exports = User;