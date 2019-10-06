const { isAuthenticated, getStockInfo } = require('../utils');

const setup = (context) => {
    const { User } = context;

    const checkValidBody = (req, res, next) => {
        if (!('symbol' in req.body)) return res.json({error: 'Stock Symbol not indicated'});
        if (!('shares' in req.body)) return res.json({error: 'Number of shares not indicated'});
        next();
    }

    const getStockPrice = (req, res, next) => {
        const { symbol } = req.body;
        getStockInfo(symbol)
            .then(info => {
                req.body.price = Number(info['latestPrice']);
                next();
            })
            .catch(err => {
                return res.json({error: err});
            })
    };

    const addUserTransaction = (req, res) => {
        const user = new User(req.user);
        const { symbol, shares, price } = req.body;
        user.addTransaction(symbol, price, shares)
            .then(success => res.json({success: true}))
            .catch(err => res.json({error: err}));
    };

    return [
        isAuthenticated,
        checkValidBody,
        getStockPrice,
        addUserTransaction
    ];
};

module.exports = setup;