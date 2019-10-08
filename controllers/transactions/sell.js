const setup = (context) => {
    
    const { User, utils } = context;
    const { isAuthenticated, getStockInfo } = utils;


    const checkValidBody = (req, res, next) => {
        if (!('symbol' in req.body)) return res.json({error: 'Stock symbol not indicated'});
        if (!('shares' in req.body)) return res.json({error: 'Number of shares not indicated'});
        next();
    };

    const getStockPrice = (req, res, next) => {
        const { symbol } = req.body;
        getStockInfo(symbol)
            .then(info => {
                req.body.price = Number(info['latestPrice']);
                next();
            })
            .catch(err => {
                console.error(err);
                return res.json({error: err});
            })
    };

    const SellTransaction = (req, res, next) => {
        const user = new User(req.user);
        const { symbol, shares, price } = req.body;
        user.SellStock(symbol, price, shares)
            .then(success => res.json({success: true}))
            .catch(err => {
                console.error(err);
                return res.json({error: err})
            });
    }; 

    return [
        isAuthenticated,
        checkValidBody,
        getStockPrice,
        SellTransaction
    ];
};

module.exports = setup;