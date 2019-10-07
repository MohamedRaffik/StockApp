const { MongoClient } = require('mongodb');

const CreateConnection = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.MONGODB_URI, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, (err, db) => {
            if (err) {
                reject('Unable to connect to database');
                return;
            }
            const database = db.db();
            database.createCollection('Users', (err, res) => {
                if (err) {
                    reject('Users collection could not be created');
                    return;
                }
                console.log('Users collection created');
                resolve(database);
            });
        });
    });
};



module.exports = {
    User: (db) => {
        /**
         * User Class for interacting with the database
         */
        class User {
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

            addTransaction(symbol, price, shares) {
                return new Promise((resolve, reject) => {
                    const purchase_amount = Number(price) * Number(shares);
                    if (this.cash < purchase_amount) {
                        reject('Purchase failed, not enough money');
                        return;
                    }
                    this.transactions.push({ symbol, price, shares });
                    this.portfolio[symbol] = symbol in this.portfolio ? this.portfolio[symbol] + shares : shares;
                    this.cash = Number(this.cash - purchase_amount);
                    db.collection('Users').updateOne({_id: this.email}, { 
                        $set: {
                            transactions: this.transactions,
                            portfolio: this.portfolio,
                            cash: this.cash
                        }
                    }, { upsert: true }).then(res => resolve(res))
                    .catch(err => { console.log(err); reject('Transaction could not be completed')});
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
                            if (user) {
                                resolve(new User({...user, email: user._id}));
                                return;
                            }
                            reject('Account not found')
                            return;
                        }).catch(err => reject(err));
                });
            }
        }

        return User;
    },
    CreateConnection,
};