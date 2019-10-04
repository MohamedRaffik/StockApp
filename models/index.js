const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: 'stockapp-254822',
    keyFilename:'google-credentials.json'
});

class User {
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

    async addTransactions(transactions) {
        try {
            this.data.transactions.concat(transactions);
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

    async insert() {
        try {
            const exists = await User.get(this.data.email);
            if (exists) throw Error('User exists');
            await db.collection('Users').doc(this.data.email).set({...this.data});
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async get(email) {
        try {
            const user = await db.collection('Users').doc(email).get();
            if (user.exists) return new User(user.data());
            throw Error('User not found');

        } catch (e) { 
            console.log(e);
            return false; 
        } 
    }
};

module.exports = User;