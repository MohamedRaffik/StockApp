const { MongoClient } = require('mongodb');

const CreateConnection = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.MONGODB_URI, {}, (err, db) => {
            if (err) return reject('Unable to connect to database');
            const database = db.db();
            database.createCollection('Users', (err, res) => {
                if (err) return reject('Users collection could not be created');
                console.log('Users collection created');
                return resolve(database);
            });
        });
    });
};

const User = (db) => class User {
    /**
     * Create a user object
     * @param {Object} data - Information about the user
     * @param {String} data.name - Name of the user
     * @param {String} data.email - Email of the user
     * @param {String} data.hash - Hash of the password of the user
     * @param {Array} [data.transactions=[]] - Transactions of the user
     * @param {Object} [data.portfolio={}] - Portfolio of the user
     * @param {Number} [data.cash=5000] - Current cash of the user 
     */
    constructor({ name, email, hash, transactions, portfolio, cash }) {
        const FieldError = (field) => new Error(`User class instantied without ${field} field`);
        if (name === undefined) throw FieldError('name');
        this.name = name;
        if (email === undefined) throw FieldError('email');
        this.email = email;
        if (hash === undefined) throw FieldError('hash');
        this.hash = hash;
        this.transactions = transactions === undefined ? [] : transactions;
        this.portfolio = portfolio === undefined ? {} : portfolio;
        this.cash = cash === undefined ? 5000 : cash;
    }

    PurchaseStock(symbol, price, shares) {
        return new Promise((resolve, reject) => {
            const amount = Number(price) * Number(shares);
            if (this.cash < amount) return reject('Purchase failed, not enough money');
            this.transactions.push({ symbol, price, shares, type: 'purchase' });
            this.portfolio[symbol] = symbol in this.portfolio ? this.portfolio[symbol] + shares : shares;
            this.cash = Number(this.cash - amount);
            db.collection('Users').updateOne({_id: this.email}, { 
                $set: {
                    transactions: this.transactions,
                    portfolio: this.portfolio,
                    cash: this.cash
                }
            }, { upsert: true }).then(res => resolve(res))
            .catch(err => reject('Transaction could not be completed'));
        });
    }

    SellStock(symbol, price, shares) {
        return new Promise((resolve, reject) => {
            const amount = Number(price) * Number(shares);
            if (!(symbol in this.portfolio)) return reject('You do not own stocks with this symbol');
            if (shares > this.portfolio[symbol]) return reject('You do not own enough stocks to sell');
            this.transactions.push({ symbol, price, shares, type: 'sell' });
            this.portfolio[symbol] -= shares
            if (this.portfolio[symbol] === 0) delete this.portfolio[symbol];
            this.cash += amount;
            db.collection('Users').updateOne({_id: this.email}, {
                $set: {
                    transactions: this.transactions,
                    portfolio: this.portfolio,
                    cash: this.cash
                }
            }, { upsert: true }).then(res => resolve(res))
            .catch(err => reject('Transaction could not completed'));
        });
    }

    insert() {
        return new Promise((resolve, reject) => {
            db.collection('Users').insertOne({
                name: this.name,
                _id: this.email,
                hash: this.hash,
                transactions: this.transactions,
                portfolio: this.portfolio,
                cash: this.cash
            }).then(res => resolve(this))
            .catch(err => reject('Account exists with this email'));
        });
    }

    static get(email) {
        return new Promise((resolve, reject) => {
            db.collection('Users').findOne({_id: email})
                .then(user => {
                    if (user) return resolve(new User({...user, email: user._id }));
                    return reject('Account not found')
                }).catch(err => reject(err));
        });
    }
};


module.exports = {
    User,
    CreateConnection,
};