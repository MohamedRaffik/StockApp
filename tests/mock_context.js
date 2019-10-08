class Collection {
    constructor() {
        this.data = {};
    }

    insertOne(object) {
        return new Promise((resolve, reject) => {
            if (!('_id' in object)) {
                reject('_id field not specified');
                return;
            }
            if (object._id in this.data) {
                reject('Account exists with this email');
                return;
            }
            this.data[object._id] = object;
            resolve(this.data[object._id]);
        });
    }

    updateOne(selector, object) {
        return new Promise((resolve, reject) => {
            if (!('_id' in selector)) {
                reject('_id field not specified');
                return;
            }
            if (!(selector._id in this.data)) {
                reject(`Document with _id '${selector._id}' is not in this collection`);
                return;
            }
            for (let key in object.$set) this.data[selector._id][key] = object.$set[key];
            resolve(this.data[selector._id]);
        });
    }

    findOne(selector) {
        return new Promise((resolve, reject) => {
            if (!('_id' in selector)) {
                reject('_id field not specified');
                return;
            }
            if (!(selector._id in this.data)) {
                reject(`Document with _id '${selector._id}' is not in this collection`);
                return;
            }
            resolve(this.data[selector._id]);
        });
    }
} 


class Database {
    constructor() {
        this.data = {};
    }

    collection(name) {
        if (!(name in this.data)) {
            this.data[name] = new Collection();
        }
        return this.data[name];
    }

    clear() {
        this.data = {};
    }
}

class Request {
    login(user, callback) {
        this.user = user;
        callback();
    }
}

class Response {
    status(code) {
        this.statusCode = code;
        return this;
    }

    json(object) {
        this.jsonData = object;
        return this;
    }

    send(string) {
        this.data = string;
        return this;
    }
}

const db = new Database();
const utils = require('../controllers/utils');

/**
 * 
 * @param {('AAPL'|'GOOG')} stock_symbol 
 */
const getStockInfo = (stock_symbol) => {
    return new Promise((resolve, reject) => {
        const isApple = stock_symbol === 'AAPL';
        resolve({
            symbol: isApple ? 'AAPL' : 'GOOG',
            companyName: isApple ? 'Apple, Inc.' : 'Alphabet, Inc.',
            open: isApple ? '222.98' : '1343.00',
            latestPrice: isApple ? '240.12' : '1206.78',
        });
    });
}

utils.getStockInfo = getStockInfo;

const User = require('../models').User(db);
const passport = require('../passport')(User);

module.exports = {
    context: {
        User,
        passport,
        utils: require('../controllers/utils'),
        clearDB: () => db.clear()
    },
    Request,
    Response,
};